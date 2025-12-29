CREATE OR REPLACE FUNCTION send_subscription_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "Notification" 
  ("userId","title","description")
  VALUES (NEW."id",'اشتراك جديد','عزيزي المستخدم تمت عملية اشتراكك بباقة ' || NEW."subscription" || 'بنجاح.');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_update_user_subscription_send_notification
AFTER UPDATE OF "subscription" ON "User"
FOR EACH ROW 
EXECUTE FUNCTION send_subscription_notification();
