package com.chat.domain;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;

/**
 * a Message sent to a chat room from a user
 */
@Entity
@Table(name="messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    private Room room;

    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    private String content;

    private LocalDateTime date;

    @OneToOne(fetch = FetchType.EAGER)
    private File file;

    public Message(Room room, User user, String content, LocalDateTime date, File file) {
        this.room = room;
        this.user = user;
        this.content = content;
        this.date = date;
        this.file = file;
    }

    public Message() {

    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime time) {
        this.date = time;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String message) {
        this.content = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }
}
