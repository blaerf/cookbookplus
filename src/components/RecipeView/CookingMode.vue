<!--
SPDX-FileCopyrightText: 2026 blaerf

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
    <NcModal
        size="full"
        :name="name"
        :has-previous="stepIndex > 0"
        :has-next="!isFinished"
        @previous="previousStep"
        @next="nextStep"
        @close="close"
    >
        <div class="cooking-mode">
            <header class="cooking-mode__header">
                <h2>{{ name }}</h2>
                <p class="cooking-mode__progress-label">
                    {{
                        isFinished
                            ? t('cookbook', 'All steps done')
                            : t('cookbook', 'Step {current} of {total}', {
                                  current: stepIndex + 1,
                                  total: instructions.length,
                              })
                    }}
                </p>
                <progress :value="stepIndex" :max="instructions.length" />
            </header>

            <div class="cooking-mode__body">
                <section class="cooking-mode__step">
                    <template v-if="!isFinished">
                        <span class="cooking-mode__step-number">
                            {{ stepIndex + 1 }}
                        </span>
                        <VueShowdown
                            :markdown="instructions[stepIndex]"
                            class="cooking-mode__step-text"
                        />
                    </template>
                    <div v-else class="cooking-mode__finish">
                        <h3>{{ t('cookbook', 'Done!') }}</h3>
                        <p>
                            {{
                                /* prettier-ignore */
                                t('cookbook', 'Start a timer if you need one, or exit the cooking mode.')
                            }}
                        </p>
                        <label class="cooking-mode__minutes">
                            {{ t('cookbook', 'Minutes') }}
                            <input
                                v-model.number="timerMinutes"
                                type="number"
                                min="1"
                            />
                        </label>
                        <RecipeTimer
                            :value="timerValue"
                            :timer="true"
                            :label="t('cookbook', 'Timer')"
                            class="cooking-mode__timer"
                        />
                    </div>
                </section>

                <aside
                    v-if="ingredients.length"
                    class="cooking-mode__ingredients"
                >
                    <h3>{{ t('cookbook', 'Ingredients') }}</h3>
                    <ul>
                        <RecipeIngredient
                            v-for="(ingredient, idx) in ingredients"
                            :key="'ingr' + idx"
                            :ingredient="ingredient"
                            :ingredient-has-correct-syntax="true"
                            :recipe-ingredients-have-subgroups="
                                ingredientsHaveSubgroups
                            "
                        />
                    </ul>
                </aside>
            </div>

            <footer class="cooking-mode__navigation">
                <NcButton :disabled="stepIndex === 0" @click="previousStep">
                    <template #icon>
                        <ChevronLeftIcon :size="20" />
                    </template>
                    {{ t('cookbook', 'Previous step') }}
                </NcButton>
                <NcButton
                    v-if="!isFinished"
                    variant="primary"
                    @click="nextStep"
                >
                    <template #icon>
                        <ChevronRightIcon :size="20" />
                    </template>
                    {{
                        stepIndex === instructions.length - 1
                            ? t('cookbook', 'Finish')
                            : t('cookbook', 'Next step')
                    }}
                </NcButton>
                <NcButton v-else variant="primary" @click="close">
                    <template #icon>
                        <CloseIcon :size="20" />
                    </template>
                    {{ t('cookbook', 'Exit cooking mode') }}
                </NcButton>
            </footer>
        </div>
    </NcModal>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import NcButton from '@nextcloud/vue/components/NcButton';
import NcModal from '@nextcloud/vue/components/NcModal';
import ChevronLeftIcon from 'icons/ChevronLeft.vue';
import ChevronRightIcon from 'icons/ChevronRight.vue';
import CloseIcon from 'icons/Close.vue';
import useWakeLock from '../../composables/useWakeLock';
import type { RecipeTimer as RecipeTimerValue } from '../../types/RecipeTimer';
import RecipeIngredient from './RecipeIngredient.vue';
import RecipeTimer from './RecipeTimer.vue';

const t = window.t;

const props = defineProps<{
    name: string;
    /** Instruction markdown strings. Content should be sanitized. */
    instructions: string[];
    /** Ingredient markdown strings with the total amounts. Content should be sanitized. */
    ingredients: string[];
    ingredientsHaveSubgroups: boolean;
    cookTime?: RecipeTimerValue | null;
}>();

const emit = defineEmits<{ close: [] }>();

const wakeLock = useWakeLock();

/** Index of the shown step. `instructions.length` is the finish screen. */
const stepIndex = ref(0);

const timerMinutes = ref(
    props.cookTime
        ? props.cookTime.hours * 60 + props.cookTime.minutes || 1
        : 10,
);

const isFinished = computed(() => stepIndex.value >= props.instructions.length);

const timerValue = computed<RecipeTimerValue>(() => {
    const total = Math.max(1, Math.floor(Number(timerMinutes.value) || 0));
    return { hours: Math.floor(total / 60), minutes: total % 60, seconds: 0 };
});

const previousStep = () => {
    if (stepIndex.value > 0) {
        stepIndex.value -= 1;
    }
};

const nextStep = () => {
    if (!isFinished.value) {
        stepIndex.value += 1;
    }
};

const close = () => {
    emit('close');
};

onMounted(() => {
    wakeLock.request();
    // Fails silently on browsers without element fullscreen (e.g. iPhone).
    // The full size modal is the fallback then.
    document.documentElement.requestFullscreen?.().catch(() => {});
});

onUnmounted(() => {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
});
</script>

<script lang="ts">
export default {
    name: 'CookingMode',
};
</script>

<style lang="scss" scoped>
.cooking-mode {
    display: flex;
    height: 100%;
    box-sizing: border-box;
    flex-direction: column;
    padding: 1rem 1.5rem;
    gap: 1rem;
}

.cooking-mode__header {
    h2 {
        margin: 0 3rem 0.25rem 0;
    }

    progress {
        width: 100%;
    }
}

.cooking-mode__progress-label {
    color: var(--color-text-maxcontrast);
}

.cooking-mode__body {
    display: flex;
    min-height: 0;
    flex: 1;
    gap: 2rem;
    overflow-y: auto;
}

.cooking-mode__step {
    flex: 2;
    font-size: 1.5rem;
    line-height: 1.5;
}

.cooking-mode__step-number {
    display: inline-block;
    width: 2.5em;
    height: 2.5em;
    border: 2px solid var(--color-primary-element);
    border-radius: 50%;
    margin-bottom: 1rem;
    font-weight: bold;
    line-height: 2.5em;
    text-align: center;
}

.cooking-mode__step-text {
    white-space: pre-line;

    :deep(ol > li) {
        list-style-type: decimal;
    }

    :deep(ul > li) {
        list-style-type: disc;
    }

    :deep(ol > li),
    :deep(ul > li) {
        margin-inline-start: 1.5em;
    }

    :deep(a) {
        text-decoration: underline;
    }
}

.cooking-mode__finish {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;

    h3 {
        font-size: 2rem;
    }
}

.cooking-mode__minutes input {
    width: 6em;
    font-size: 1.25rem;
    margin-inline-start: 0.5rem;
}

.cooking-mode__timer {
    width: 100%;
    max-width: 25rem;
    margin: 1.5rem 0 0 1.5rem;
    font-size: 2rem;

    :deep(button) {
        width: 56px;
        height: 56px;
        background-size: 24px;
    }
}

.cooking-mode__ingredients {
    flex: 1;
    border-inline-start: 1px solid var(--color-border);
    font-size: 1.1rem;
    padding-inline-start: 1.5rem;

    ul {
        padding: 0;
        list-style: none;
    }

    :deep(li) {
        margin-bottom: 0.5em;
        cursor: pointer;
    }
}

.cooking-mode__navigation {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

@media (max-width: 850px) {
    .cooking-mode {
        padding: 0.75rem;
    }

    .cooking-mode__body {
        flex-direction: column;
        gap: 1rem;
    }

    .cooking-mode__step {
        flex: none;
        font-size: 1.25rem;
    }

    .cooking-mode__ingredients {
        flex: none;
        padding-top: 1rem;
        border-top: 1px solid var(--color-border);
        border-inline-start: none;
        padding-inline-start: 0;
    }
}
</style>
