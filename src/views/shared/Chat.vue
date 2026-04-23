<template>
  <div class="chat-root" style="background: #E9DEEA; min-height: 100vh;">

    <!-- ===================== LIST MODE ===================== -->
    <template v-if="!conversationId">
      <!-- Header -->
      <div class="list-header px-4 pt-4 pb-3">
        <div class="d-flex align-center justify-space-between">
          <h1 class="page-title">Messages</h1>
          <div v-if="totalUnread > 0" class="unread-badge">{{ totalUnread }}</div>
        </div>
      </div>

      <!-- Conversation List -->
      <div class="px-4">
        <div v-if="conversations.length === 0" class="empty-state">
          <v-icon size="56" color="#ddd" class="mb-3">mdi-message-off-outline</v-icon>
          <p class="empty-text">No conversations yet.</p>
          <p class="empty-sub">Book a trip to start chatting!</p>
        </div>

        <div v-else class="conversations-list">
          <div
            v-for="conv in conversations"
            :key="conv.id"
            class="conv-row"
            @click="router.push('/chat/' + conv.id)"
          >
            <!-- Avatar -->
            <div class="conv-avatar" :style="{ background: getAvatarColor(getOtherParticipant(conv).name) }">
              {{ getInitials(getOtherParticipant(conv).name) }}
            </div>

            <!-- Content -->
            <div class="conv-content">
              <div class="conv-top-row">
                <span class="conv-name" :class="{ 'conv-name--unread': conv.unread }">
                  {{ getOtherParticipant(conv).name }}
                </span>
                <span class="conv-time">{{ formatConvTime(conv.lastMessageTime) }}</span>
              </div>
              <div class="conv-preview-row">
                <span class="conv-preview" :class="{ 'conv-preview--unread': conv.unread }">
                  {{ truncate(conv.lastMessage, 40) }}
                </span>
                <div v-if="conv.unread" class="unread-dot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ===================== CHAT MODE ===================== -->
    <template v-else>
      <!-- Fixed Top Bar -->
      <div class="chat-topbar">
        <v-btn icon variant="text" size="small" class="back-btn" @click="router.push('/chat')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <div class="d-flex align-center gap-2 flex-1 min-width-0">
          <div class="chat-avatar" :style="{ background: getAvatarColor(otherUser?.name || '') }">
            {{ getInitials(otherUser?.name || 'U') }}
          </div>
          <div class="min-width-0">
            <div class="chat-username">{{ otherUser?.name || 'User' }}</div>
            <div class="d-flex align-center gap-1">
              <div class="active-dot"></div>
              <span class="active-label">Active</span>
            </div>
          </div>
        </div>

        <v-btn icon variant="text" size="small">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </div>

      <!-- Messages Area -->
      <div class="messages-area" ref="messagesContainer">
        <template v-for="(group, gi) in groupedMessages" :key="gi">
          <!-- Date Separator -->
          <div class="date-separator">
            <span class="date-sep-text">{{ group.date }}</span>
          </div>

          <!-- Messages in group -->
          <div
            v-for="msg in group.messages"
            :key="msg.id"
            class="message-row"
            :class="{ 'message-row--sent': isSent(msg), 'message-row--received': !isSent(msg) }"
          >
            <div
              class="message-bubble"
              :class="{ 'bubble-sent': isSent(msg), 'bubble-received': !isSent(msg) }"
            >
              <p class="bubble-text">{{ msg.text }}</p>
            </div>
            <div
              class="msg-timestamp"
              :class="{ 'ts-sent': isSent(msg), 'ts-received': !isSent(msg) }"
            >
              {{ formatMsgTime(msg.timestamp) }}
            </div>
          </div>
        </template>

        <!-- Typing indicator (decorative) -->
        <div v-if="showTyping" class="message-row message-row--received">
          <div class="message-bubble bubble-received typing-bubble">
            <div class="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Fixed Message Input -->
      <div class="message-input-bar">
        <v-text-field
          v-model="newMessage"
          placeholder="Message..."
          variant="outlined"
          density="compact"
          hide-details
          rounded
          class="message-input"
          @keydown.enter.prevent="sendMessage"
        />
        <button
          class="send-btn"
          :class="{ 'send-btn--active': newMessage.trim() }"
          @click="sendMessage"
          :disabled="!newMessage.trim()"
        >
          <v-icon size="18" color="white">mdi-send</v-icon>
        </button>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockMessages, mockConversations, mockUsers } from '@/data/mock.js'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const conversationId = computed(() => route.params.id || null)
const currentUser = computed(() => authStore.user || { id: 'u1', name: 'Me' })

const conversations = ref([...mockConversations])
const messages = ref([...mockMessages])
const newMessage = ref('')
const messagesContainer = ref(null)
const showTyping = ref(false)

// Filtered messages for current conversation
const filteredMessages = computed(() => {
  if (!conversationId.value) return []
  return messages.value
    .filter(m => m.conversationId === conversationId.value)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
})

// Current conversation object
const currentConversation = computed(() => {
  return conversations.value.find(c => c.id === conversationId.value)
})

// Other user in chat
const otherUser = computed(() => {
  if (!currentConversation.value) return null
  const otherId = currentConversation.value.participants?.find(id => id !== currentUser.value.id)
  return mockUsers?.find(u => u.id === otherId) || { id: otherId, name: currentConversation.value.otherUserName || 'User' }
})

// Total unread count
const totalUnread = computed(() => conversations.value.filter(c => c.unread).length)

// Group messages by date
const groupedMessages = computed(() => {
  const groups = []
  let currentDate = null
  let currentGroup = null

  filteredMessages.value.forEach(msg => {
    const msgDate = formatDateGroup(msg.timestamp)
    if (msgDate !== currentDate) {
      currentDate = msgDate
      currentGroup = { date: msgDate, messages: [] }
      groups.push(currentGroup)
    }
    currentGroup.messages.push(msg)
  })

  return groups
})

function isSent(msg) {
  return msg.senderId === currentUser.value.id
}

function getOtherParticipant(conv) {
  if (conv.otherUserName) return { name: conv.otherUserName }
  const otherId = conv.participants?.find(id => id !== currentUser.value.id)
  return mockUsers?.find(u => u.id === otherId) || { name: 'User' }
}

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const avatarColors = ['#FF4DA6', '#3D5B3E', '#E8A94A', '#C23B3B', '#7B5EA7', '#2196F3']
function getAvatarColor(name) {
  if (!name) return avatarColors[0]
  let hash = 0
  for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff
  return avatarColors[hash % avatarColors.length]
}

function truncate(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}

function formatConvTime(ts) {
  if (!ts) return ''
  const date = new Date(ts)
  const now = new Date()
  const diff = now - date
  const day = 86400000
  if (diff < day && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (diff < 2 * day) return 'Yesterday'
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function formatMsgTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDateGroup(ts) {
  if (!ts) return 'Today'
  const date = new Date(ts)
  const now = new Date()
  const diff = now - date
  const day = 86400000
  if (diff < day && date.getDate() === now.getDate()) return 'Today'
  if (diff < 2 * day) return 'Yesterday'
  return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text) return

  const newMsg = {
    id: 'msg_' + Date.now(),
    conversationId: conversationId.value,
    senderId: currentUser.value.id,
    text,
    timestamp: new Date().toISOString()
  }

  messages.value.push(newMsg)
  newMessage.value = ''

  // Update conversation last message
  const conv = conversations.value.find(c => c.id === conversationId.value)
  if (conv) {
    conv.lastMessage = text
    conv.lastMessageTime = newMsg.timestamp
  }

  await scrollToBottom()

  // Simulate typing + reply
  showTyping.value = true
  await scrollToBottom()
  setTimeout(async () => {
    showTyping.value = false
    const replyMsg = {
      id: 'msg_' + (Date.now() + 1),
      conversationId: conversationId.value,
      senderId: otherUser.value?.id || 'u2',
      text: getAutoReply(text),
      timestamp: new Date().toISOString()
    }
    messages.value.push(replyMsg)
    if (conv) {
      conv.lastMessage = replyMsg.text
      conv.lastMessageTime = replyMsg.timestamp
    }
    await scrollToBottom()
  }, 1800)
}

function getAutoReply(text) {
  const replies = [
    'Got it, thanks for the update!',
    'Sounds good 👍',
    'Perfect, I\'ll be ready.',
    'Understood. See you soon!',
    'Thanks for letting me know.',
    'Great, looking forward to it!'
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}

onMounted(async () => {
  if (conversationId.value) {
    await scrollToBottom()
  }
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    await scrollToBottom()
  }
})
</script>

<style scoped>
.chat-root {
  display: flex;
  flex-direction: column;
}

/* ===== LIST MODE ===== */
.list-header {
  background: #E9DEEA;
}

.page-title {
  font-family: 'Archivo', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #0A0A0A;
  margin: 0;
}

.unread-badge {
  background: #FF4DA6;
  color: white;
  border: 2px solid #0A0A0A;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-size: 12px;
  font-weight: 700;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-text {
  font-family: 'Archivo', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #888;
  margin: 0 0 4px;
}

.empty-sub {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  color: #bbb;
  margin: 0;
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.conv-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 0;
}

.conv-row:active {
  background: rgba(255, 77, 166, 0.05);
}

.conv-row:first-child {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.conv-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: white;
  border: 2px solid #0A0A0A;
  flex-shrink: 0;
}

.conv-content {
  flex: 1;
  min-width: 0;
}

.conv-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
}

.conv-name {
  font-family: 'Archivo', sans-serif;
  font-size: 15px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conv-name--unread {
  font-weight: 700;
  color: #0A0A0A;
}

.conv-time {
  font-family: 'Archivo', sans-serif;
  font-size: 11px;
  color: #aaa;
  flex-shrink: 0;
  margin-left: 8px;
}

.conv-preview-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.conv-preview {
  font-family: 'Archivo', sans-serif;
  font-size: 13px;
  color: #aaa;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.conv-preview--unread {
  color: #555;
  font-weight: 500;
}

.unread-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #FF4DA6;
  flex-shrink: 0;
  border: 1.5px solid #0A0A0A;
}

/* ===== CHAT MODE ===== */
.chat-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-bottom: 2px solid #0A0A0A;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 100;
}

.back-btn {
  flex-shrink: 0;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: white;
  border: 2px solid #0A0A0A;
  flex-shrink: 0;
}

.chat-username {
  font-family: 'Archivo', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #0A0A0A;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.active-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4CAF50;
  animation: blink 2s infinite;
  flex-shrink: 0;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.active-label {
  font-family: 'Archivo', sans-serif;
  font-size: 11px;
  color: #4CAF50;
}

/* Messages */
.messages-area {
  padding: 72px 12px 90px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  min-height: 100vh;
}

.date-separator {
  display: flex;
  justify-content: center;
  margin: 12px 0 8px;
}

.date-sep-text {
  font-family: 'Archivo', sans-serif;
  font-size: 11px;
  color: #aaa;
  background: rgba(0, 0, 0, 0.06);
  padding: 3px 10px;
  border-radius: 20px;
}

.message-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
}

.message-row--sent {
  align-items: flex-end;
}

.message-row--received {
  align-items: flex-start;
}

.message-bubble {
  max-width: 78%;
  padding: 10px 14px;
  word-break: break-word;
}

.bubble-sent {
  background: #FF4DA6;
  color: white;
  border-radius: 18px 18px 4px 18px;
  border: 1.5px solid rgba(0, 0, 0, 0.12);
}

.bubble-received {
  background: white;
  color: #0A0A0A;
  border-radius: 18px 18px 18px 4px;
  border: 1.5px solid #0A0A0A;
}

.bubble-text {
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.msg-timestamp {
  font-family: 'Archivo', sans-serif;
  font-size: 10px;
  color: #bbb;
  margin-top: 3px;
}

.ts-sent { text-align: right; padding-right: 4px; }
.ts-received { text-align: left; padding-left: 4px; }

/* Typing indicator */
.typing-bubble {
  padding: 12px 16px;
}

.typing-dots {
  display: flex;
  gap: 4px;
  align-items: center;
  height: 14px;
}

.typing-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #aaa;
  animation: typingBounce 1.2s infinite;
}

.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* Input bar */
.message-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-top: 2px solid #0A0A0A;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;
}

.message-input {
  flex: 1;
}

.message-input :deep(.v-field) {
  border-radius: 24px !important;
  border: 1.5px solid #ddd;
  background: #f9f9f9;
  font-family: 'Archivo', sans-serif;
  font-size: 14px;
}

.message-input :deep(.v-field:focus-within) {
  border-color: #FF4DA6;
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ddd;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.send-btn--active {
  background: #FF4DA6;
  border-color: #0A0A0A;
  box-shadow: 2px 2px 0 #0A0A0A;
}

.send-btn--active:active {
  box-shadow: 0px 0px 0 #0A0A0A;
  transform: translate(2px, 2px);
}

.send-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.min-width-0 {
  min-width: 0;
}

.flex-1 {
  flex: 1;
}
</style>
