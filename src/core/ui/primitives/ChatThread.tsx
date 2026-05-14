import { useState } from "react";
import { Box, Button, TextField, Typography, Avatar, IconButton, Chip, Tooltip } from "@mui/material";
import { Delete, Close } from "@mui/icons-material";
import { Reply, Trash, SmilePlus, Send, BadgeCheck } from "lucide-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { type ChatMessage } from "../../../../shared/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import { useRef, useEffect } from "react";

type ChatThreadProps = {
  threadId: string;
  style?: React.CSSProperties;
  messages: ChatMessage[];
  onSend: (payload: { message: string; replyToId?: string; mentions?: string[] }) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
  currentUserId: string;
  organizerId?: string | number;
  onToggleReaction: (messageId: string, emoji: string) => Promise<void>;
};

export function ChatThread({
  threadId,
  style,
  messages,
  onSend,
  onDelete,
  currentUserId,
  organizerId,
  onToggleReaction
}: ChatThreadProps) {
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [emojiPicker, setEmojiPicker] = useState<{
    messageId: string | null;
    currentEmoji?: string | null;
  }>({ messageId: null, currentEmoji: null });

    const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "🤐", "😁", "😎", "😡", "🤯", "🥺", "🤮", "😭", "🤒", "🤩", "💪", "👏", "👋", "💯"];
    const MAX_MESSAGE_LENGTH = 1000;
    const MAX_MENTIONS = 5;

    dayjs.extend(relativeTime);
    dayjs.locale("en");

  function renderMentions(msg: string, mentions: string[]) {
    let result = msg;
    for (const m of mentions) {
      result = result.replaceAll(
        `@${m}`,
        `<span style="color:#1976d2;font-weight:600">@${m}</span>`
      );
    }
    return result;
  }

  async function toggleReaction(messageId: string, emoji: string) {
      await onToggleReaction(messageId, emoji);
  }


  function openEmojiPicker(messageId: string, emoji: string | null = null, mentionsCount: number) {
    if (mentionsCount >= MAX_MENTIONS) return;
    setEmojiPicker({
      messageId,
      currentEmoji: emoji
    });
  }


  function closeEmojiPicker() {
    setEmojiPicker({ messageId: null, currentEmoji: null });
  }

    async function handleSubmit() {
        const msg = input.trim();
        if (!msg) return;

        await onSend({
          message: msg,
          replyToId: replyTo?.id,
          mentions: []
        });

        setInput("");
        setReplyTo(null);
    }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


  return (
    <Box display="flex" flexDirection="column" sx={style}>
      <Box sx={{  overflowY: "auto", mb: 2, flex: 1}}>
        {messages.map((m) => {
          const mentions = m.mentions ?? [];
          const rendered = renderMentions(m.message, mentions);

          const canDelete =
            m.user.id === String(currentUserId) ||
            (organizerId && String(organizerId) === String(currentUserId));

          return (
            <Box key={m.id} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", mb: 1.5, alignItems: "flex-start", padding: 1, border: "1px solid #dfecf1", borderRadius: 1 }}>
                <Avatar
                  src={m.user.avatar ?? ""}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ flex: 1, color: "#8d8d8d" }}>
                      {m.user.name}
                      {m.isAuthor && (
                        <Tooltip title="Author">
                        <BadgeCheck size={16} color="green" style={{ marginLeft: 5 }}/>
                        </Tooltip>
                      )}
                    </Typography>
                    <Tooltip title={dayjs(m.createdAt).format('DD.MM.YYYY HH:mm')}>
                      <Typography variant="caption" sx={{ opacity: 0.6 }}>
                        {dayjs(m.createdAt).fromNow()}
                      </Typography>
                    </Tooltip>
                  </Box>

                  {m.replyTo && (
                    <Box sx={{ pl: 2, borderLeft: "2px solid #ccc", mb: 1 }}>
                      <Typography variant="caption">
                        Reply to {m.replyTo.user.name}: "{m.replyTo.message.slice(0, 80)}"
                      </Typography>
                    </Box>
                  )}

                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap" }}
                    dangerouslySetInnerHTML={{ __html: rendered }}
                  />
                  
                  <Box sx={{ display: "flex", gap: 1, mt: 0.5, alignItems: "center", justifyContent: "flex-end" }}>
                    <Box sx={{ flex: 1, textAlign: "left"}}>
                      {(m.reactions ?? []).map(r => (
                        <Typography 
                        key={r.emoji} 
                        variant="body2" 
                        sx={{ display: "inline-block", mr: 1, cursor: "pointer"}}
                        //onClick={() => openEmojiPicker(m.id, r.emoji, (m.reactions ?? []).length)}
                        onClick={() => toggleReaction(m.id, r.emoji)}>
                        
                            {r.emoji}
                        </Typography>
                        
                    ))}
                    </Box>
                    <Tooltip title="Reply">
                      <IconButton
                        size="small"
                        onClick={() => setReplyTo(m)}
                      >
                        <Reply width="15px" height="15px" />
                      </IconButton>
                    </Tooltip>

                    {canDelete && (
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => onDelete(m.id)}>
                          <Trash fontSize="small" width="15px" height="15px"  />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Emoji">
                      <IconButton
                        size="small"
                        disabled={(m.reactions ?? []).length >= MAX_MENTIONS}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          openEmojiPicker(m.id, null, (m.reactions ?? []).length);
                        }}
                      >
                        <SmilePlus width="15px" height="15px" />
                      </IconButton>
                    </Tooltip>

                </Box>
                {emojiPicker.messageId === m.id &&(
                    <Box
                        sx={{
                        width: "stretch",
                        position: "fixed",
                        top: "50%",
                        left: "0",
                        display: "flex",
                        gap: 1,
                        p: 1,
                        mt: 0.5,
                        borderRadius: 1,
                        bgcolor: "background.paper",
                        border: "1px solid #ccc",
                        boxShadow: "0 0 20px 0px #00000038;",
                        transform: "translateY(-50%)",
                        alignItems: "center",
                        zIndex: 5
                        }}
                    >
                      <Box sx={{ display: "flex", flex: 1, flexWrap: "wrap" }}>
                        {EMOJIS.map(e => (
                          
                          <IconButton
                          size="small"
                              key={e}
                                onClick={() => {
                                  console.log("EMOJI", m.id,e)
                                toggleReaction(m.id, e);
                                closeEmojiPicker();
                              }}
                          >
                              <span style={{ fontSize: 20 }}>{e}</span>
                          </IconButton>
                          
                        ))}
                      </Box>
                        <IconButton onClick={closeEmojiPicker}>
                        <Close />
                        </IconButton>
                    </Box>
                    )}
                  </Box>
                </Box>
              </Box>

                

              <div ref={bottomRef} />
            </Box>
            
          );
        })}
      </Box>

      

      <Box sx={{ display: "flex", gap: 1, position: "sticky", bottom: 0, p: 1, backgroundColor: "background.paper", zIndex: 1 }}>
        <Box sx={{ position: "relative", flex: 1 }}>
          {replyTo && (
            <Box sx={{ my: 1, p: 1, bgcolor: "action.hover", borderRadius: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" sx={{ flex: 1 }}>
                Replying to {replyTo.user.name}: "{replyTo.message.slice(0, 50)}"
              </Typography>
              <IconButton size="small" onClick={() => setReplyTo(null)}>
                <Close />
              </IconButton>
            </Box>
          )}
        <TextField
          fullWidth
          size="small"
          placeholder="Napiš zprávu..."
          value={input}
          onChange={(e) => {
            const v = e.target.value;
            if (v.length <= MAX_MESSAGE_LENGTH) {
              setInput(v);
            }
          }}
          multiline
          minRows={1}
          maxRows={4}
          InputProps={{
          endAdornment: (
              <Tooltip title="Send" placement="right">
              <IconButton size="small" onClick={handleSubmit}>
                  <Send />
              </IconButton>
              </Tooltip>
          ),
          }}
        />
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            fontSize: "10px",
            bottom: 0,
            left: 7,
            opacity: 0.6,
            zIndex: 5
          }}
        >
          {input.length}/{MAX_MESSAGE_LENGTH}
        </Typography>
      </Box>
      </Box>
    </Box>
  );
}
