package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"net/url"
	"path"
	"time"
)

// RecaptchaResponse struct definition
type RecaptchaResponse struct {
	Success bool `json:"success"`
}

// User credentials
var users = map[string]string{
	"reykal": "alhikam123",
	"jihan":   "admin",
	"admin": "admin", 
	
	// Add more users as needed
}


const secretKey = "6Ld41UUpAAAAANDiKpLd-xl8tVpOUWgDDqbarwUo"

func verifyRecaptcha(response string) bool {
	resp, err := http.PostForm("https://www.google.com/recaptcha/api/siteverify", url.Values{"secret": {secretKey}, "response": {response}})
	if err != nil {
		// handle error
		return false
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		// handle error
		return false
	}
	var recaptchaResponse RecaptchaResponse
	err = json.Unmarshal(body, &recaptchaResponse)
	if err != nil {
		// handle error
		return false
	}
	return recaptchaResponse.Success
}


func handle(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseGlob("templates/*")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	name := ""
	if r.URL.Path == "/" {
		name = "index.html"
	} else {
		name = path.Base(r.URL.Path)
	}

	data := struct {
		Time    time.Time
		User    string
		Message string // Add a field for the error message
	}{
		Time: time.Now(),
	}

	// Check for user session
	cookie, err := r.Cookie("session_token")
	if err == nil {
		sessionToken := cookie.Value
		if _, ok := users[sessionToken]; ok {
			data.User = sessionToken
		}
	}

	if err := tmpl.ExecuteTemplate(w, name, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("error", err)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		r.ParseForm()
		username := r.Form.Get("username")
		password := r.Form.Get("password")

		if storedPassword, ok := users[username]; ok && password == storedPassword {
			http.SetCookie(w, &http.Cookie{
				Name:  "session_token",
				Value: username,
			})
			http.Redirect(w, r, "/schedule.html", http.StatusSeeOther)
			return
		} else {
			// Set an error message in the template data
			http.Redirect(w, r, "/?error=invalid_credentials", http.StatusSeeOther)
			return
		}
	}

	// Handle non-POST requests to the login page
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func logoutHandler(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:   "session_token",
		MaxAge: -1,
	})
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func scheduleHandler(w http.ResponseWriter, r *http.Request) {
	// Check for a valid session before serving the schedule page
	cookie, err := r.Cookie("session_token")
	if err != nil || users[cookie.Value] == "" {
		// Redirect to the home page or login page if not authenticated
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	// Serve the schedule.html page
	tmpl, err := template.ParseFiles("templates/schedule.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	data := struct {
		User string
	}{
		User: users[cookie.Value],
	}

	if err := tmpl.Execute(w, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("error", err)
	}
}

func main() {
	fmt.Println("http server up!")
	http.Handle(
		"/static/",
		http.StripPrefix(
			"/static/",
			http.FileServer(http.Dir("static")),
		),
	)
	http.HandleFunc("/", handle)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/logout", logoutHandler)
	http.HandleFunc("/schedule.html", scheduleHandler)
	http.ListenAndServe(":0", nil)
}
