package controllers

import play.api._
import play.api.mvc._
import play.api.Play.current

import anorm._ 
import play.api.db.DB

import play.api.libs.json._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def data = Action { request =>
    val json = request.body.asJson.getOrElse(JsString("bad request data"))

    val referrer = (json\ "metadata" \ "referrer").as[String]
    val location = (json \ "metadata" \ "location").as[String]

    DB.withTransaction { implicit c =>
      val events = (json \\ "events").map { event => 

        val eventType = (json \ "type").as[String]
        val timeStamp = (json \ "timeStamp").as[Int]
        val data      = (json \ "data").as[String]
        val seq       = (json \ "event_sequence").as[Int]

        SQL("""INSERT INTO 
                  events(seq, event_type, time_stamp, referrer, location, data) 
                  values({seq}, {event_type}, {time_stamp}, {referrer}, {location}, {data})""")
          .on('seq -> seq,
              'event_type -> eventType, 
              'time_stamp -> timeStamp,
              'referrer -> referrer,
              'location -> location,
              'data -> data) 
          .executeInsert()
      }
    }


    Ok(json)
  }

}
