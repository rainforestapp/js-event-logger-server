# --- !Ups
 
CREATE TABLE events (
    id serial,
    event_type varchar(255) NOT NULL,
    time_stamp integer NOT NULL,
    data text NOT NULL,
    PRIMARY KEY (id)
);
 
# --- !Downs
 
DROP TABLE events;
