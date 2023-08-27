<template>
	<v-progress-linear v-model="passwordScore" :color="color()" height="25" />
	{{ passwordScore }}
</template>
<script setup lang="ts">
	const props = defineProps<{ password: string }>();

	const { getPasswordScore } = useStrongPassword();

	const passwordScore = ref(getPasswordScore(props.password));

	const color = () => {
		if (passwordScore.value < 30) return "red";
		if (passwordScore.value < 60) return "orange";
		return "green";
	};
</script>
