import os
import pg8000.native
import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

# إعدادات قاعدة بيانات Supabase
DB_HOST = "aws-0-eu-central-1.pooler.supabase.com"
DB_PORT = 5432
DB_NAME = "postgres"
DB_USER = "postgres.ckuilzfgcsetahpzygph"
DB_PASS = "Kenan_adele2025"

# إعدادات Meta Webhook (قراءة التوكن من Render مباشرة)
VERIFY_TOKEN = os.environ.get("VERIFY_TOKEN", "smart_rep_secret_2026")
WHATSAPP_TOKEN = os.environ.get(
    "WHATSAPP_TOKEN",
    "EAAPSsRZBftDABSZAPrMPSqr9BKO7KYaHT3S6wKIUoIKhYZAYr3ZBZC2DDDhhgWTvnwudurbgu89vGZBfm7Obgqt2n6w1FwXr8gBJ2jrC8ary7TbOyKs4Lbq3vqQSoebL8ZAj5G3ryPcWtdSOjehnM5sJANWlcZAJwqJkihnNq0lKDxSSZC0QfhGlCG5YwwOFuvROpUBoupIyKy1ZBZBTmUpHdVMyXefEMsFkZCU3ZC7iEM99DGVn2GfT0ouZC6CiZA38rmCWrysNotVnZAz6wu8y5P10kJxhFoCm",
)


def get_db_connection():
  return pg8000.native.Connection(
      user=DB_USER,
      password=DB_PASS,
      host=DB_HOST,
      port=DB_PORT,
      database=DB_NAME,
      ssl_context=True,
  )


def send_whatsapp_message(phone_number_id, to_phone, text):
  url = f"https://graph.facebook.com/v20.0/{phone_number_id}/messages"
  headers = {
      "Authorization": f"Bearer {WHATSAPP_TOKEN}",
      "Content-Type": "application/json",
  }
  payload = {
      "messaging_product": "whatsapp",
      "to": to_phone,
      "type": "text",
      "text": {"body": text},
  }
  try:
    response = requests.post(url, headers=headers, json=payload, timeout=10)
    print(
        f"Meta Response Status: {response.status_code}, Body: {response.text}",
        flush=True,
    )
    return response.status_code == 200
  except Exception as e:
    print(f"Error sending message: {e}", flush=True)
    return False


@app.route("/webhook", methods=["GET"])
def verify_webhook():
  mode = request.args.get("hub.mode")
  token = request.args.get("hub.verify_token")
  challenge = request.args.get("hub.challenge")

  if mode == "subscribe" and token == VERIFY_TOKEN:
    return challenge, 200
  return "Verification token mismatch", 403


@app.route("/webhook", methods=["POST"])
def receive_message():
  data = request.get_json()

  try:
    entry = data["entry"][0]["changes"][0]["value"]
    if "messages" not in entry:
      return jsonify({"status": "ignored"}), 200

    phone_number_id = entry["metadata"]["phone_number_id"]
    message_data = entry["messages"][0]
    customer_phone = message_data["from"]

    if message_data.get("type") != "text":
      return jsonify({"status": "unsupported_format"}), 200

    customer_text = message_data["text"]["body"].strip()
  except (KeyError, IndexError):
    return jsonify({"status": "invalid_payload"}), 400

  conn = None
  try:
    conn = get_db_connection()
    company_records = conn.run(
        "SELECT id, name FROM companies WHERE whatsapp_phone_number_id = :pid;",
        pid=str(phone_number_id),
    )

    if not company_records:
      # إذا لم يجد الرقم في قاعدة البيانات سيرد عليك فوراً بدلاً من التجاهل
      fallback_msg = (
          f"مرحباً! وصلتنا رسالتك: '{customer_text}'\n\n"
          f"البوت يعمل بنجاح، ولكن الرقم التجريبي {phone_number_id} غير مسجل في جدول companies في قاعدة البيانات."
      )
      send_whatsapp_message(phone_number_id, customer_phone, fallback_msg)
      return jsonify({"status": "company_not_found_but_replied"}), 200

    company_id = company_records[0][0]
    company_name = company_records[0][1]

    conn.run(f"SET LOCAL app.current_company_id = '{company_id}';")

    products = conn.run(
        "SELECT name, price, stock FROM products WHERE name ILIKE :q;",
        q=f"%{customer_text}%",
    )

    if products:
      reply_text = f"مرحباً بك في *{company_name}* 👋\n\nالمنتجات المتطابقة:\n"
      for row in products:
        p_name, p_price, p_stock = row[0], row[1], row[2]
        status = "متوفر فوراً ✅" if p_stock > 0 else "غير متوفر حالياً ❌"
        reply_text += (
            f"\n• *{p_name}*\n  السعر: {p_price} ريال\n  الحالة: {status}\n"
        )
    else:
      reply_text = (
          f"أهلاً بك في *{company_name}*!\nلم نجد نتائج مطابقة لـ"
          f' "{customer_text}". اكتب اسم المنتج لعرض سعره وتوفره.'
      )

    send_whatsapp_message(phone_number_id, customer_phone, reply_text)

  except Exception as err:
    print(f"Database error: {err}", flush=True)
    send_whatsapp_message(
        phone_number_id, customer_phone, "حدث خطأ في الاتصال بقاعدة البيانات."
    )
  finally:
    if conn:
      conn.close()

  return jsonify({"status": "processed"}), 200


if __name__ == "__main__":
  port = int(os.environ.get("PORT", 5000))
  app.run(host="0.0.0.0", port=port)
