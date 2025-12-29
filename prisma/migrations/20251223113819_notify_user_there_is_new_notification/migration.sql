CREATE OR REPLACE FUNCTION notify_user_new_notification()
RETURNS TRIGGER AS $$
DECLARE 
   payload JSON;
BEGIN 
   payload = json_build_object(
    'userId' , NEW.userId,
    'text' , NEW.title
   ); 
   PERFORM pg_notify('new_notification',payload::text);
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER new_notification_trigger
AFTER INSERT ON "Notification"
FOR EACH ROW EXECUTE FUNCTION notify_user_new_notification();

