---
name: Bug report
about: Report a bug to help us improve the game room stability.
title: "[Bug] Fix player panel flickering/swapping on join"
labels: ''
assignees: ''

---

### Description
입장 시 플레이어 위치가 바뀌거나 '대기 중' 상태가 잠깐 노출되는 현상 (UX 저해)

### Cause
`mySocketId`와 `players` 상태가 따로 업데이트되면서 발생하는 **Race Condition**. 첫 렌더링 시 `find()` 로직에서 '나'를 제대로 특정하지 못함.

### Steps
1. 방 입장 (`join-room`)
2. `room-updated` 이벤트 수신 시 UI 흔들림 확인

### Proposed Solution
- **State 통합**: `players`와 `myId`를 하나의 객체로 묶어 렌더링 동기화 보장
- **고정 Key**: `left-me`, `right-opponent`로 키값을 고정해 DOM 순서 유지
