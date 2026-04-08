<script setup>
import { computed  } from 'vue';

//determine if user is logged in
const isLoggedIn = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  }
});

//header logic
const
