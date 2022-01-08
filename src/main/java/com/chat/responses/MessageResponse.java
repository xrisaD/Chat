package com.chat.responses;

import com.chat.domain.File;

public class MessageResponse {
    private String username;
    private String content;
    private String time;
    private Long roomId;
    private Long messageId;
    private File file;

    public MessageResponse(String username, String content, String time, Long roomId, File file) {
        this.username = username;
        this.content = content;
        this.time = time;
        this.roomId = roomId;
        this.file = file;
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


    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }
}
