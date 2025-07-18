// src/pages/Playlist.tsx
import styles from "../styles/playlist.module.css";
import Clouds from "../components/Clouds";
import Footer from "../components/Footer";
import BotaoVoltar from "../components/BotaoVoltar";
import contentStyles from "../styles/contentWrapper.module.css";

import React, { useRef, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import { useMusic } from "../context/MusicPlayerContext";

const Playlist: React.FC = () => {
  // Removidos audioRef e audioSourceRef, pois o áudio é global no MusicProvider
  const {
    playlist,
    currentSong,
    playSong,
    isPlaying,
    togglePlayPause,
    setVolume,
  } = useMusic();
  // const navigate = useNavigate();

  const headshellInputRef = useRef<HTMLInputElement>(null); // Referência para o checkbox
  const vinylRef = useRef<HTMLDivElement>(null);
  const playlistSelectRef = useRef<HTMLSelectElement>(null);

  // Efeito para sincronizar o estado do checkbox com o isPlaying do contexto
  useEffect(() => {
    if (headshellInputRef.current) {
      headshellInputRef.current.checked = isPlaying;
    }
  }, [isPlaying]);

  // Configura listeners para o controle de play/pause visual e o controle de volume.
  useEffect(() => {
    const headshellInput = headshellInputRef.current;
    const volumeControl = document.getElementById(
      "volume-control"
    ) as HTMLInputElement;

    // Funções para os handlers (declaradas dentro do useEffect para ter acesso às refs e props estáveis)
    const handleHeadshellChange = () => {
      togglePlayPause();
    };

    const handleVolumeChange = (e: Event) => {
      setVolume(parseFloat((e.target as HTMLInputElement).value));
    };

    // Adiciona listeners se os elementos existirem
    if (headshellInput) {
      headshellInput.addEventListener("change", handleHeadshellChange);
    }

    if (volumeControl) {
      volumeControl.value = "0.7"; // Define o valor inicial
      volumeControl.addEventListener("input", handleVolumeChange);
    }

    // Função de limpeza combinada
    return () => {
      if (headshellInput) {
        headshellInput.removeEventListener("change", handleHeadshellChange);
      }
      if (volumeControl) {
        volumeControl.removeEventListener("input", handleVolumeChange);
      }
    };
  }, [togglePlayPause, setVolume]); // Depende das funções do contexto

  // Função para mudar a faixa
  const handleChangeTrack = () => {
    if (playlistSelectRef.current) {
      const selectedSongId = playlistSelectRef.current.value;
      const selectedSong = playlist.find((song) => song.id === selectedSongId);
      if (selectedSong) {
        playSong(selectedSong); // Toca a música selecionada usando a função do contexto
      }
    }
  };

  // Efeito para definir a música inicial na seleção da playlist
  useEffect(() => {
    if (playlistSelectRef.current && currentSong) {
      playlistSelectRef.current.value = currentSong.id;
    }
  }, [currentSong]); // Atualiza a seleção quando a música atual muda

  return (
    <>
      <Clouds />

      <div className={contentStyles.contentWrapper}>
        <div className={styles.recordPlayer}>
          {/* Usamos um input hidden e um label para simular o clique no braço */}
          <input
            type="checkbox"
            id="headshellInput"
            className={styles.headshellInput}
            ref={headshellInputRef}
            hidden
          />
          <label
            htmlFor="headshellInput"
            className={styles.headshellLabel}
          ></label>{" "}
          {/* Label que o usuário interage */}
          {/* O elemento audio não está mais aqui, ele está no MusicProvider */}
          <input
            type="range"
            max="1"
            min="0"
            step="0.1"
            id="volume-control"
            className={styles.volumeControl}
          />
          <div className={styles.plinth}></div>
          <div className={styles.platter}></div>
          {/* Aplica a classe vinylAnimation condicionalmente para controlar a animação */}
          <div
            className={`${styles.vinyl} ${
              isPlaying ? styles.vinylAnimation : ""
            }`}
            ref={vinylRef}
          ></div>
          <div className={styles.topCircle}></div>
        </div>
      </div>

      {/* Lista de reprodução */}
      <select
        id="playlist"
        className={styles.playlistSelect}
        onChange={handleChangeTrack}
        ref={playlistSelectRef}
      >
        {playlist.map((song) => (
          <option key={song.id} value={song.id}>
            {song.title} - {song.artist}
          </option>
        ))}
      </select>

      <BotaoVoltar />

      <Footer />
    </>
  );
};

export default Playlist;
