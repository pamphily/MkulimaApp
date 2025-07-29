const MOODLE_TOKEN = "207aff44288f676104b5d9eb7b0191fb";
const DOMAIN = "https://lms.dlab.or.tz";
const COURSE_ENDPOINT = `${DOMAIN}/webservice/rest/server.php?wstoken=${MOODLE_TOKEN}&wsfunction=core_course_get_courses&moodlewsrestformat=json`;
const CATEGORY_ENDPOINT = `${DOMAIN}/webservice/rest/server.php?wstoken=${MOODLE_TOKEN}&wsfunction=core_course_get_categories&moodlewsrestformat=json`;

interface CreateUser {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
}

interface EnrollUser { 
    roleid: 5
    course
}

export async function createUserDlab(payload: CreateUser) {
  const formData = new URLSearchParams();
  formData.append("wstoken", MOODLE_TOKEN);
  formData.append("wsfunction", "core_user_create_users");
  formData.append("moodlewsrestformat", "json");

  formData.append("users[0][username]", payload.username);
  formData.append("users[0][password]", payload.password);
  formData.append("users[0][firstname]", payload.first_name);
  formData.append("users[0][lastname]", payload.last_name);
  formData.append("users[0][email]", payload.email);
  formData.append("users[0][auth]", "manual");
  formData.append("users[0][preferences][0][type]", "auth_forcepasswordchange");
  formData.append("users[0][preferences][0][value]", "true");

  const response = await fetch(`${DOMAIN}/webservice/rest/server.php`, {
    method: "POST",
    headers: {
      ContentType: "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  return await response.json();
}

export async function enrollCallback(userid: string, courseid: string) {
    const formData = new URLSearchParams();
    formData.append("wstoken", MOODLE_TOKEN);
    formData.append("wsfunction", "enrol_manual_enrol_users");
    formData.append("moodlewsrestformat", "json");
  
    formData.append("enrolments[0][roleid]", "5");
    formData.append("enrolments[0][userid]", userid);
    formData.append("enrolments[0][courseid]", courseid);
  
    const response = await fetch(`${DOMAIN}/webservice/rest/server.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Fix: Correct header key
      },
      body: formData.toString(),
    });
  
    if (response.ok) {
      return "success";
    } else {
      const errorData = await response.json();
      return {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      };
    }
  }
  