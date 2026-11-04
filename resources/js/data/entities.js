/**
 * Y-BOCS scale questions, symptom checklist & severity bands.
 *
 * Ported 1:1 from the old backend `ybocs_data.py`. This now lives entirely
 * on the frontend as a plain JS module, so the assessment flow no longer
 * needs a network call (`/api/ybocs/meta`) just to render the questionnaire.
 */

export const YBOCS_QUESTIONS = [
  {
    id: 1,
    section: "obsessions",
    title: "Time Occupied by Obsessive Thoughts",
    question: "How much of your time is occupied by obsessive thoughts?",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Less than 1 hr/day or occasional occurrence" },
      { value: 2, label: "1 to 3 hrs/day or frequent" },
      { value: 3, label: "Greater than 3 and up to 8 hrs/day or very frequent occurrence" },
      { value: 4, label: "Greater than 8 hrs/day or nearly constant occurrence" },
    ],
  },
  {
    id: 2,
    section: "obsessions",
    title: "Interference Due to Obsessive Thoughts",
    question:
      "How much do your obsessive thoughts interfere with your work, school, social, or other important role functioning?",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Slight interference with social or other activities, but overall performance not impaired" },
      { value: 2, label: "Definite interference with social or occupational performance, but still manageable" },
      { value: 3, label: "Causes substantial impairment in social or occupational performance" },
      { value: 4, label: "Incapacitating" },
    ],
  },
  {
    id: 3,
    section: "obsessions",
    title: "Distress Associated with Obsessive Thoughts",
    question: "How much distress do your obsessive thoughts cause you?",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Not too disturbing" },
      { value: 2, label: "Disturbing, but still manageable" },
      { value: 3, label: "Very disturbing" },
      { value: 4, label: "Near constant and disabling distress" },
    ],
  },
  {
    id: 4,
    section: "obsessions",
    title: "Resistance Against Obsessions",
    question: "How much of an effort do you make to resist the obsessive thoughts?",
    options: [
      { value: 0, label: "Try to resist all the time" },
      { value: 1, label: "Try to resist most of the time" },
      { value: 2, label: "Make some effort to resist" },
      { value: 3, label: "Yield to all obsessions without attempting to control them, but with some reluctance" },
      { value: 4, label: "Completely and willingly yield to all obsessions" },
    ],
  },
  {
    id: 5,
    section: "obsessions",
    title: "Degree of Control Over Obsessive Thoughts",
    question: "How much control do you have over your obsessive thoughts?",
    options: [
      { value: 0, label: "Complete control" },
      { value: 1, label: "Usually able to stop or divert obsessions with some effort and concentration" },
      { value: 2, label: "Sometimes able to stop or divert obsessions" },
      { value: 3, label: "Rarely successful in stopping or dismissing obsessions, can only divert attention with difficulty" },
      { value: 4, label: "Obsessions are completely involuntary, rarely able to even momentarily alter obsessive thinking" },
    ],
  },
  {
    id: 6,
    section: "compulsions",
    title: "Time Spent Performing Compulsive Behaviors",
    question: "How much time do you spend performing compulsive behaviors?",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Less than 1 hr/day or occasional performance of compulsive behaviors" },
      { value: 2, label: "From 1 to 3 hrs/day, or frequent performance of compulsive behaviors" },
      { value: 3, label: "More than 3 and up to 8 hrs/day, or very frequent performance of compulsive behaviors" },
      { value: 4, label: "More than 8 hrs/day, or near constant performance of compulsive behaviors" },
    ],
  },
  {
    id: 7,
    section: "compulsions",
    title: "Interference Due to Compulsive Behaviors",
    question:
      "How much do your compulsive behaviors interfere with your work, school, social, or other important role functioning?",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Slight interference with social or other activities, but overall performance not impaired" },
      { value: 2, label: "Definite interference with social or occupational performance, but still manageable" },
      { value: 3, label: "Causes substantial impairment in social or occupational performance" },
      { value: 4, label: "Incapacitating" },
    ],
  },
  {
    id: 8,
    section: "compulsions",
    title: "Distress Associated with Compulsive Behavior",
    question: "How would you feel if prevented from performing your compulsion(s)?",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Only slightly anxious if compulsions prevented" },
      { value: 2, label: "Anxiety would mount but remain manageable if compulsions prevented" },
      { value: 3, label: "Prominent and very disturbing increase in anxiety if compulsions interrupted" },
      { value: 4, label: "Incapacitating anxiety from any intervention aimed at modifying activity" },
    ],
  },
  {
    id: 9,
    section: "compulsions",
    title: "Resistance Against Compulsions",
    question: "How much of an effort do you make to resist the compulsions?",
    options: [
      { value: 0, label: "Always try to resist" },
      { value: 1, label: "Try to resist most of the time" },
      { value: 2, label: "Make some effort to resist" },
      { value: 3, label: "Yield to almost all compulsions without attempting to control them, but with some reluctance" },
      { value: 4, label: "Completely and willingly yield to all compulsions" },
    ],
  },
  {
    id: 10,
    section: "compulsions",
    title: "Degree of Control Over Compulsive Behavior",
    question:
      "How strong is the drive to perform the compulsive behavior? How much control do you have over the compulsions?",
    options: [
      { value: 0, label: "Complete control" },
      { value: 1, label: "Pressure to perform the behavior but usually able to exercise voluntary control over it" },
      { value: 2, label: "Strong pressure to perform behavior, can control it only with difficulty" },
      { value: 3, label: "Very strong drive to perform behavior, must be carried to completion, can only delay with difficulty" },
      { value: 4, label: "Drive to perform behavior experienced as completely involuntary and overpowering" },
    ],
  },
];

export const OBSESSION_CHECKLIST = [
  {
    category: "Aggressive Obsessions",
    items: [
      "Fear might harm self",
      "Fear might harm others",
      "Violent or horrific images",
      "Fear of blurting out obscenities or insults",
      "Fear of doing something else embarrassing",
      "Fear will act on unwanted impulses (e.g. to stab friend)",
      "Fear will steal things",
      "Fear will harm others because not careful enough",
      "Fear will be responsible for something else terrible happening",
    ],
  },
  {
    category: "Contamination Obsessions",
    items: [
      "Concerns or disgust with bodily waste or secretions",
      "Concern with dirt or germs",
      "Excessive concern with environmental contaminants",
      "Excessive concern with household items (cleansers, solvents)",
      "Excessive concern with animals (e.g. insects)",
      "Bothered by sticky substances or residues",
      "Concerned will get ill because of contaminant",
      "Concerned will get others ill by spreading contaminant",
    ],
  },
  {
    category: "Sexual Obsessions",
    items: [
      "Forbidden or perverse sexual thoughts, images, or impulses",
      "Content involves children or incest",
      "Content involves homosexuality",
      "Sexual behavior toward others",
    ],
  },
  {
    category: "Hoarding/Saving Obsessions",
    items: ["Hoarding/saving obsessions (distinguish from hobbies)"],
  },
  {
    category: "Religious Obsessions",
    items: ["Concerned with sacrilege and blasphemy", "Excess concern with right/wrong, morality"],
  },
  {
    category: "Symmetry/Exactness Obsessions",
    items: ["Accompanied by magical thinking", "Not accompanied by magical thinking"],
  },
  {
    category: "Somatic Obsessions",
    items: ["Concern with illness or disease", "Excessive concern with body part or aspect of appearance"],
  },
  {
    category: "Miscellaneous Obsessions",
    items: [
      "Need to know or remember",
      "Fear of saying certain things",
      "Fear of not saying just the right thing",
      "Fear of losing things",
      "Intrusive (non-violent) images",
      "Intrusive nonsense sounds, words, or music",
      "Bothered by certain sounds/noises",
      "Lucky/unlucky numbers",
      "Colors with special significance",
      "Superstitious fears",
    ],
  },
];

export const COMPULSION_CHECKLIST = [
  {
    category: "Cleaning/Washing Compulsions",
    items: [
      "Excessive or ritualized handwashing",
      "Excessive or ritualized showering, bathing, toothbrushing, grooming",
      "Involves cleaning of household items or other inanimate objects",
      "Other measures to prevent or remove contact with contaminants",
    ],
  },
  {
    category: "Checking Compulsions",
    items: [
      "Checking locks, stove, appliances, etc.",
      "Checking that did not/will not harm others",
      "Checking that did not/will not harm self",
      "Checking that nothing terrible did/will happen",
      "Checking that did not make mistake",
      "Checking tied to somatic obsessions",
    ],
  },
  {
    category: "Repeating Compulsions",
    items: [
      "Re-reading or re-writing",
      "Need to repeat routine activities (e.g. in/out door, up/down from chair)",
    ],
  },
  {
    category: "Counting Compulsions",
    items: ["Counting compulsions"],
  },
  {
    category: "Ordering/Arranging Compulsions",
    items: ["Ordering/arranging compulsions"],
  },
  {
    category: "Hoarding/Collecting Compulsions",
    items: ["Hoarding/collecting compulsions"],
  },
  {
    category: "Miscellaneous Compulsions",
    items: [
      "Mental rituals (other than checking/counting)",
      "Excessive listmaking",
      "Need to tell, ask, or confess",
      "Need to touch, tap, or rub",
      "Rituals involving blinking or staring",
      "Measures to prevent harm to self",
      "Measures to prevent harm to others",
      "Measures to prevent terrible consequence",
      "Ritualized eating behaviors",
      "Superstitious behaviors",
      "Trichotillomania",
      "Other self damaging or self-mutilating behaviors",
    ],
  },
];

export const SEVERITY_BANDS = [
  { label: "Subclinical", min: 0, max: 7, color: "#F5C9A6" },
  { label: "Mild", min: 8, max: 15, color: "#E89866" },
  { label: "Moderate", min: 16, max: 23, color: "#C8612C" },
  { label: "Severe", min: 24, max: 31, color: "#8E3A1C" },
  { label: "Extreme", min: 32, max: 40, color: "#3F1C0E" },
];

export function severityBand(total) {
  if (total <= 7) return "Subclinical";
  if (total <= 15) return "Mild";
  if (total <= 23) return "Moderate";
  if (total <= 31) return "Severe";
  return "Extreme";
}

/** Same shape the old `/api/ybocs/meta` endpoint used to return, built locally. */
export const YBOCS_META = {
  questions: YBOCS_QUESTIONS,
  obsession_checklist: OBSESSION_CHECKLIST,
  compulsion_checklist: COMPULSION_CHECKLIST,
  severity_bands: SEVERITY_BANDS,
};
