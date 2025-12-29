CREATE OR REPLACE FUNCTION update_user_properties_subscription()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Property"
  SET "subscription" = NEW."subscription"
  WHERE "userId" = NEW."id";

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_update_user_subscription
AFTER UPDATE OF "subscription" ON "User"
FOR EACH ROW 
EXECUTE FUNCTION update_user_properties_subscription();

