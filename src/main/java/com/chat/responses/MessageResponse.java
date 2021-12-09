package com.chat.responses;

public class MessageResponse {
    private String username;
    private String content;
    private String time;
    private Long roomId;
    private String fileName;

    public MessageResponse(String username, String content, String time, Long roomId, String fileName) {
        this.username = username;
        this.content = content;
        this.time = time;
        this.roomId = roomId;
        this.fileName = fileName;
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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
