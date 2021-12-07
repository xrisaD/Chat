package com.chat.responses;

public class MessageResponse {
    private String username;
    private String content;
    private String time;
    private Long roomId;

    public MessageResponse(String username, String content, String time, Long roomId) {
        this.username = username;
        this.content = content;
        this.time = time;
        this.roomId = roomId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }
}
