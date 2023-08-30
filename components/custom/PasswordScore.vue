<template>
	<v-progress-linear
		v-model="passwordScore"
		:color="getScoreValue('color')"
		height="45"
		rounded
	>
		<template v-slot:default="{ value }">
			<v-icon>{{ getScoreValue("smiley") }}</v-icon>
		</template>
	</v-progress-linear>
</template>
<script setup lang="ts">
	const props = defineProps<{ password: string }>();

	const { getPasswordScore } = useStrongPassword();

	const passwordScore = computed(() =>
		Math.floor(getPasswordScore(props.password))
	);

	type scoreMapValuesType = {
		color: string;
		smiley: string;
	};
	type scoreMapType = {
		[key: number]: scoreMapValuesType;
		else: scoreMapValuesType;
	};
	const scoreMap: scoreMapType = {
		50: {
			color: "red",
			smiley: "mdi-emoticon-sad-outline",
		},
		60: {
			color: "orange",
			smiley: "mdi-emoticon-neutral-outline",
		},
		else: { color: "green", smiley: "mdi-emoticon-happy-outline" },
	};

	const getScoreValue = (key: keyof scoreMapValuesType) => {
		let result = scoreMap["else"][key];
		for (let score in scoreMap) {
			let scoreNumber = Number(score);
			if (!isNaN(scoreNumber) && passwordScore.value < scoreNumber) {
				result = scoreMap[score][key];
				break;
			}
		}
		return result;
	};
</script>
