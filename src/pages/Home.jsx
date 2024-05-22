import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import api from "../api";
import { Note } from "../components/Note";
import "../styles/Home.css";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  // const history = useHistory();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log("data", data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Note Deleted!");
        } else {
          alert("Failed to delete note.");
        }
        getNotes(); // Refresh the list of notes
      })
      .catch((error) => alert(error));
  };

  const createNote = () => {
    //event.preventDefault(); // Prevents the default form submission behavior so that you can see pop up alert but if we comment this it will refresh and won't able to see the pop up.
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          alert("Note Created!");
        } else {
          alert("Failed to create note.");
        }
        getNotes(); // Refresh the list of notes
      })
      .catch((err) => alert(err));
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      if (refreshToken) {
        await api.post("/api/logout/", { refresh: refreshToken });
      }
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      // history.push("/login");
      // Redirect to the login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div>
      <div className="header">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) => (
          <Note note={note} onDelete={deleteNote} key={note.id} />
        ))}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <br />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          name="content"
          id="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Home;
