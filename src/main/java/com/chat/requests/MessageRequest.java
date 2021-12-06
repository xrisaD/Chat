package com.chat.requests;

public class Message {
    private Long roomId;
    private String content;

    public String getContent() {
        return content;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    @Override
    public String toString() {
        return "Message{" +
                "roomId=" + roomId +
                ", content='" + content + '\'' +
                '}';
    }
}
