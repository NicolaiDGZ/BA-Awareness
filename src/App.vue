<script setup lang="ts">
import Phaser from 'phaser';
import { ref, toRaw } from 'vue';
import type { MainMenu } from './game/scenes/MainMenu';
import PhaserGame from './game/PhaserGame.vue';
</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
</template>
