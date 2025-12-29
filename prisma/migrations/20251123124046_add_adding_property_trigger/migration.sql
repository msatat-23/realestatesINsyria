CREATE OR REPLACE FUNCTION send_adding_property_notification()
RETURNS TRIGGER AS $$
BEGIN 
  INSERT INTO "Notification"
  ("userId","title","description") VALUES
  (NEW."userId",'إضافة عقار','عزيزي المستخدم العقار الذي أضفته '|| NEW."title" || ' هو قيد المراجعة في مدة أقصاها ساعتان سيتم إشعارك بالنتيجة.');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER send_under_review_notification
AFTER INSERT ON "Property"
FOR EACH ROW 
EXECUTE FUNCTION send_adding_property_notification();