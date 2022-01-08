package com.chat.requests;

import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;

/**
 * Request sent from from
 */
public class MessageRequest {
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
        return "MessageRequest{" +
                "roomId=" + roomId +
                ", content='" + content + '\'' +
                '}';
    }
}
