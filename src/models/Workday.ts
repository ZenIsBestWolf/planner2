export interface RemoteResponse {
  Report_Entry: RemoteEntry[];
}

interface RemoteEntry {
  Course_Section_Start_Date: string;
  CF_LRV_Cluster_Ref_ID: string; // cloudflare???
  Student_Course_Section_Cluster: string;
  Meeting_Patterns: string; // probably can be interpretted to custom data type
  Course_Title: string; // ????
  Locations: string; // could potentially have required valid locations
  Instructional_Format: string; // could be typed
  Waitlist_Waitlist_Capacity: string; // fraction of WAITLIST_SEATS_OCCUPPIED / WAITLIST_SEATS_AVAILABLE
  Course_Description: string; // HTML escaped course description (not frequently used apparently)
  Public_Notes: string; // ???
  Subject: string; // could be typed
  Delivery_Mode: string; // could be typed
  Academic_Level: string; // could be typed
  Section_Status: string; // could be tyed
  Credits: string; // NORMAL CREDITS
  Section_Details: string; // could be parsed/interpretted, since its Location | Meeting_Patterns
  Instructors: string; // could this become an array?
  Offering_Period: string; // could be typed
  Starting_Academic_Period_Type: string; // could be typed? !! This is the term the course is offered.
  Course_Tags: string; // records of attribute :: value
  Academic_Units: string; // what does this mean lol
  Course_Section: string; // could potentially be interpretted, but seems formalized
  Enrolled_Capacity: string; // fraction of SEATS_REMAINING/SEATS_TOTAL
  Course_Section_End_Date: string; // originally a string, could be validated against existing course section patterns
  Meeting_Day_Patterns: string; // could be an array of valid letters (days)/typed
  Course_Section_Owner: string; // could be typed (dept)
}
