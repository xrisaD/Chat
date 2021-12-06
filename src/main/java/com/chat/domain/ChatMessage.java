package com.chat.domain;

import javax.persistence.*;

@Entity
@Table(name="messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    private Room room;

    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    private String content;

    private String time;

    private MessageType messageType;

    public ChatMessage(Room room, User user, String content, String time, MessageType messageType) {
        this.room = room;
        this.user = user;
        this.content = content;
        this.time = time;
        this.messageType = messageType;
    }

    public ChatMessage() {

    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
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

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }
}
