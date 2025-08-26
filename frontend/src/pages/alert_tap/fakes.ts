/*

export { type NotificationItemModel, type NotificationType, type Actor } from "./NotificationDrawer";
import type { NotificationItemModel, NotificationType, Actor } from "./NotificationDrawer";

export const ACTORS: Actor[] = [
   { id: "a1", name: "yoonhakbaek", avatarUrl: "/avatars/ava1.png" },
   { id: "a2", name: "seoulfestaphil" },
   { id: "a3", name: "nomadc.anna", avatarUrl: "/avatars/ava2.png" },
   { id: "a4", name: "xyg_ln" },
   { id: "a5", name: "hyeonjeonglee" },
   { id: "a6", name: "miiiiiiim_7" },
];

function rid(prefix = "nid") {
   return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function randomOf<T>(arr: T[]): T {
   return arr[Math.floor(Math.random() * arr.length)];
}

function randomPastDate(maxDaysBack = 60) {
   const d = new Date();
   d.setDate(d.getDate() - Math.floor(Math.random() * maxDaysBack));
   d.setHours(10, 0, 0, 0);
   return d.toISOString();
}

export function makeFakeNotifications(count = 24): NotificationItemModel[] {
   const types: NotificationType[] = ["like", "comment", "reply", "follow", "mention"];
   const result: NotificationItemModel[] = [];
   for (let i = 0; i < count; i++) {
      const type = randomOf(types);
      const actor = randomOf(ACTORS);
      const actor2 = randomOf(ACTORS.filter(a => a.id !== actor.id));
      const multi = Math.random() < 0.35;

      const textMap: Record<NotificationType, string> = {
         like: `<b>${actor.name}</b>${multi ? `님과 <b>${actor2.name}</b>님` : "님"}이 회원님의 댓글을 좋아합니다: 공연 너무 좋았습니다❤️`,
         comment: `<b>${actor.name}</b>님이 회원님의 게시물에 댓글을 남겼습니다: DM발송완료💬`,
         reply: `<b>${actor.name}</b>님이 회원님의 댓글에 답글을 남겼습니다.`,
         follow: `<b>${actor.name}</b>님이 회원님을 팔로우하기 시작했습니다.`,
         mention: `<b>${actor.name}</b>님이 회원님을 언급했습니다.`,
         dm: `<b>${actor.name}</b>님에게서 새 메시지가 도착했습니다.`,
      } as const;

      result.push({
         id: rid(),
         type,
         actors: multi ? [actor, actor2] : [actor],
         text: textMap[type],
         createdAt: randomPastDate(60),
         unread: Math.random() < 0.45,
      });
   }
   return result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

*/