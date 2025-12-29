CREATE OR REPLACE FUNCTION send_welcoming_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "Notification" (title, description, "userId")
  VALUES (
    'أهلا وسهلا',
    'تم تسجيل دخولك بنجاح أهلا وسهلا بك في منصتنا العقارية يمكنك إضافة عقارك بسهولة الآن.',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_user_signed_up
AFTER INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION send_welcoming_notification();
