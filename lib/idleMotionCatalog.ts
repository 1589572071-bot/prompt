import type { IdleMotion } from "./types";

export const idleMotionCatalog: IdleMotion[] = [
  {
    id: "idle-default",
    name: "Default Motion",
    version: "v1.0",
    status: "Published",
    category: "Posture",
    description: "Natural front-facing waiting posture with subtle breathing, blinking, and tiny hand movements.",
    chunk: 4,
    actionPrompt:
      "The avatar holds a natural front-facing standing posture, body facing the camera, feet naturally apart at the original floor mark, shoulders relaxed, arms hanging naturally at the sides with tiny gentle slight hand movements, head slightly lifted, gaze calmly toward the viewer, with subtle breathing, occasional natural blinking, and a very soft relaxed expression without a big grin. The motion stays small, slow, and natural, like quietly waiting for instructions, with no speaking, nodding, walking, crouching, posing, or large gestures.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-default-breathing-plus",
    name: "Default Motion (Breathing Plus)",
    version: "v1.0",
    status: "Published",
    category: "Breathing",
    description: "Default waiting posture with more visible chest, abdomen, and shoulder breathing movement.",
    chunk: 4,
    actionPrompt:
      "The avatar holds a natural front-facing standing posture, body facing the camera, feet naturally apart at the original floor mark. Shoulders move with noticeable range along with breathing, arms hanging naturally at the sides with tiny gentle slight hand movements, head slightly lifted, gaze calmly toward the viewer. Breathing movements are distinct with obvious rises and falls of the chest and abdomen, occasional natural blinking, and a very soft relaxed expression without a big grin. The motion stays slow and natural, like quietly waiting for instructions, with no speaking, nodding, walking, crouching, posing, or over-exaggerated large gestures.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-hands-folded",
    name: "Hands Folded",
    version: "v1.0",
    status: "Published",
    category: "Posture",
    description: "Both hands rest lightly folded in front of the lower abdomen or waist.",
    chunk: 3,
    actionPrompt:
      "The avatar slowly brings both hands together and rests them lightly folded in front of the lower abdomen or waist, fingers loosely interlaced, shoulders relaxed, elbows soft, body slightly leaning forward in an attentive but natural waiting posture. She keeps her feet planted near the original floor mark, looks calmly toward the viewer, breathes subtly, blinks naturally, and maintains a relaxed closed-mouth expression without a sudden wide smile. The motion stays small, slow, and natural, with no speaking, nodding, walking, crouching, or dramatic posing.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-hand-on-wrist",
    name: "Hand Resting on Wrist",
    version: "v1.0",
    status: "Published",
    category: "Posture",
    description: "One hand rests gently over the opposite wrist in front of the body.",
    chunk: 3,
    actionPrompt:
      "The avatar gently places one hand over the opposite wrist in front of the body, arms relaxed with no tension, shoulders loose, feet planted near the original floor mark, and body facing forward in a quiet attentive waiting posture. She looks naturally toward the viewer, breathes subtly, blinks naturally, and keeps a calm closed-mouth expression with only a faint occasional smile. The motion stays small, slow, and natural, with no speaking, nodding, walking, crouching, arm waving, or exaggerated grin.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-adjust-clothing",
    name: "Adjust Clothing",
    version: "v1.0",
    status: "Published",
    category: "Gesture",
    description: "Both hands briefly smooth the garment downward at the center of the chest.",
    chunk: 2,
    actionPrompt:
      "The avatar stands in a front-facing standing posture with feet planted near the original floor mark and weight evenly balanced. Both hands lift from the sides and come to rest lightly on the center of the chest, then give one short gentle stroke downward on the garment within a small range. The hands then relax away from the fabric and drift back down to the sides, while the gaze lifts back toward the viewer. The motion is small and quick, with no abrupt pauses, no speaking, no crouching, no big smile, and no exaggerated posing. The upper body remains stable with subtle natural breathing throughout.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-touch-hair",
    name: "Tuck Hair",
    version: "v1.0",
    status: "Published",
    category: "Gesture",
    description: "One hand smooths a loose strand near the temple and tucks it behind the ear.",
    chunk: 2,
    actionPrompt:
      "The avatar raises one hand gently toward the side of the head, lightly smooths a loose strand of hair near the temple, tucks it back toward the ear, and gives a small natural smile before relaxing the hand down again. The motion is small, slow, and natural, like a quiet idle gesture while waiting, with feet kept near the original floor mark, no speaking, no crouching, no big grin, and no exaggerated posing.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-hands-open-close",
    name: "Small Two-Hand Open and Close",
    version: "v1.0",
    status: "Published",
    category: "Gesture",
    description: "Both hands open and close gently while the arms remain relaxed.",
    chunk: 2,
    actionPrompt:
      "The avatar slowly opens and closes both hands gently, arms relaxed with no tension, shoulders loose, feet planted near the original floor mark, and body facing forward in a quiet attentive waiting posture. She looks naturally toward the viewer, breathes subtly, blinks naturally, and keeps a calm closed-mouth expression with only a faint occasional smile. The motion stays small, slow, and natural, with no speaking, nodding, walking, crouching, arm waving, or exaggerated grin.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-arms-gentle-swing",
    name: "Arms Down with Gentle Swing",
    version: "v1.0",
    status: "Published",
    category: "Gesture",
    description: "Arms hang naturally and swing gently back and forth with visible breathing.",
    chunk: 4,
    actionPrompt:
      "The avatar holds a natural front-facing standing posture, body facing the camera, feet naturally apart at the original floor mark. Shoulders move with noticeable range along with breathing, arms hang naturally at the sides and swing gently back and forth in moderate amplitude, head slightly lifted, gaze calmly toward the viewer. Breathing movements are distinct with obvious rises and falls of the chest and abdomen, occasional natural blinking, and a very soft relaxed expression without a big grin. The motion stays slow and natural, like quietly waiting for instructions, with no speaking, nodding, walking, crouching, posing, or over-exaggerated large gestures.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-breathing-smile",
    name: "Breathing with a Smile",
    version: "v1.0",
    status: "Published",
    category: "Breathing",
    description: "Visible natural breathing with a gentle, pleasant smile.",
    chunk: 4,
    actionPrompt:
      "The avatar holds a natural front-facing standing posture, body facing the camera, feet naturally apart at the original floor mark. Shoulders move with noticeable range along with breathing, arms hang naturally at the sides, head slightly lifted, gaze calmly toward the viewer. Breathing movements are distinct with obvious rises and falls of the chest and abdomen, occasional natural blinking, wearing a gentle and pleasant smile without overdoing it. The motion stays slow and natural, like quietly waiting for instructions, with no speaking, nodding, walking, crouching, posing, or over-exaggerated large gestures.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-smile-wave",
    name: "Smile and Wave",
    version: "v1.0",
    status: "Published",
    category: "Gesture",
    description: "A light one-hand wave with a gentle smile while the feet stay fixed.",
    chunk: 4,
    actionPrompt:
      "Full-body shot of a young female avatar standing still on the spot, feet fixed, gentle toothy smile, soft blinking eyes, one hand raised to wave lightly at the camera, the other arm hanging naturally beside her body. Obvious natural breathing rises and falls in the chest and abdomen, shoulders rising and falling with the breathing rhythm, relaxed and gentle overall movements, calm and warm expression, no exaggerated movements, no walking or shifting feet.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-adjust-collar",
    name: "Adjust Collar",
    version: "v1.0",
    status: "Published",
    category: "Gesture",
    description: "One hand gently tidies the collar with soft, slow movement.",
    chunk: 4,
    actionPrompt:
      "Full-body avatar standing still with feet fixed on the ground, one hand gently tidying the collar with soft slow movements, the other arm hanging naturally beside the body. Obvious breathing rises and falls in the chest and abdomen, natural frequent blinking, faint gentle closed-mouth smile, all movements mild and relaxed, no walking, foot shifting, or exaggerated large gestures.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-hand-in-pocket",
    name: "Hand in Pocket",
    version: "v1.0",
    status: "Published",
    category: "Posture",
    description: "One hand rests loosely half-tucked into a trouser pocket.",
    chunk: 4,
    actionPrompt:
      "The avatar holds a natural front-facing standing posture, body facing the camera, feet naturally apart at the original floor mark. Shoulders move with noticeable range along with breathing, one hand half tucked loosely into a trouser pocket while the other arm hangs naturally beside the thigh, head slightly lifted, gaze calmly toward the viewer. Breathing movements are distinct with obvious rises and falls of the chest and abdomen, blinking gently, wearing a warm natural toothy smile. The motion stays slow and natural, like quietly waiting for instructions, with no speaking, nodding, walking, crouching, posing, or over-exaggerated large gestures.",
    updatedAt: "2026/7/13 14:48:00"
  },
  {
    id: "idle-hand-release",
    name: "Gentle Hand Release",
    version: "v1.0",
    status: "Published",
    category: "Gesture",
    description: "Fingers slowly curl into a soft fist and gently release beside the thighs.",
    chunk: 2,
    actionPrompt:
      "The avatar stands naturally facing forward, arms relaxed at the sides. While maintaining a calm gaze and soft expression throughout, the fingers slowly curl into a soft fist and gently release in a repeated cycle; the hands remain beside the thighs with no arm swinging. Subtle breathing and occasional blinking continue simultaneously with the hand motion. The head is slightly lifted. No speaking, walking, or large gestures.",
    updatedAt: "2026/7/13 14:48:00"
  }
];

export function getIdleMotionsByIds(ids: string[]) {
  return ids
    .map((id) => idleMotionCatalog.find((motion) => motion.id === id))
    .filter((motion): motion is IdleMotion => Boolean(motion));
}

export function formatIdleMotionPrompt(ids: string[]) {
  const motions = getIdleMotionsByIds(ids).filter((motion) => motion.status === "Published");
  if (!motions.length) return "Maintain a neutral, still posture with subtle natural breathing.";

  return motions.map((motion) => `${motion.name} (${motion.chunk} chunks): ${motion.actionPrompt}`).join("\n");
}
