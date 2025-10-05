export interface RadioStation {
  id: string;
  name: string;
  streamUrl: string;
}

export interface Alarm {
  id: string;
  time: string; // Format: "HH:MM"
  station: RadioStation;
  repeatDays: number[];
  isActive: boolean;
  label?: string;
  notificationIds?: string[]; // IDs des notifications programmées
  vibrate?: boolean; // Activer le vibreur progressif
}

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "1",
    name: "NRJ",
    streamUrl:
      "https://scdn.nrjaudio.fm/fr/30001/mp3_128.mp3?origine=fluxradios",
  },
  {
    id: "2",
    name: "Skyrock",
    streamUrl: "https://icecast.skyrock.net/s/natio_mp3_128k",
  },
  {
    id: "3",
    name: "RTL",
    streamUrl: "https://streaming.radio.rtl.fr/rtl-1-44-128",
  },
  {
    id: "4",
    name: "Europe 1",
    streamUrl: "https://europe1.lmn.fm/europe1.mp3",
  },
  {
    id: "5",
    name: "France Inter",
    streamUrl: "https://icecast.radiofrance.fr/franceinter-midfi.mp3",
  },
  {
    id: "6",
    name: "RFM",
    streamUrl: "https://rfm-live-mp3-128.scdn.arkena.com/rfm.mp3",
  },
  {
    id: "7",
    name: "Nostalgie",
    streamUrl: "https://scdn.nrjaudio.fm/fr/30601/mp3_128.mp3",
  },
  {
    id: "8",
    name: "Fun Radio",
    streamUrl: "https://icecast.funradio.fr/fun-1-44-128",
  },
  {
    id: "9",
    name: "Radio Paradise - Main Mix",
    streamUrl: "https://stream.radioparadise.com/aac-320",
  },
  {
    id: "10",
    name: "Radio Paradise - Mellow",
    streamUrl: "https://stream.radioparadise.com/mellow-320",
  },
  {
    id: "11",
    name: "Radio Paradise - Rock",
    streamUrl: "https://stream.radioparadise.com/rock-320",
  },
  {
    id: "12",
    name: "Radio Paradise - World/Etc",
    streamUrl: "https://stream.radioparadise.com/world-etc-320",
  },
];

export const DAYS_OF_WEEK = [
  { id: 1, name: "Lun", fullName: "Lundi" }, // Lundi = 1 en JS
  { id: 2, name: "Mar", fullName: "Mardi" }, // Mardi = 2 en JS
  { id: 3, name: "Mer", fullName: "Mercredi" }, // etc.
  { id: 4, name: "Jeu", fullName: "Jeudi" },
  { id: 5, name: "Ven", fullName: "Vendredi" },
  { id: 6, name: "Sam", fullName: "Samedi" },
  { id: 0, name: "Dim", fullName: "Dimanche" }, // Dimanche = 0 en JS (à la fin)
];
