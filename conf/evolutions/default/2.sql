# --- !Ups
 
ALTER TABLE events add column event_sequence integer;
ALTER TABLE events add column referrer text;
ALTER TABLE events add column location text;
 
# --- !Downs
 
ALTER TABLE events drop column event_sequence;
ALTER TABLE events drop column referrer;
ALTER TABLE events drop column location;
