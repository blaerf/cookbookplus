// SPDX-FileCopyrightText: 2026 blaerf
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { onUnmounted } from 'vue';

/**
 * Keeps the screen awake while the calling component is mounted and
 * `request()` has been called. The lock is re-acquired when the page becomes
 * visible again because browsers release it when the tab is hidden.
 */
export default function useWakeLock() {
	let sentinel: WakeLockSentinel | null = null;
	let wanted = false;

	const acquire = async () => {
		if (!('wakeLock' in navigator)) {
			console.info('WakeLock API is not supported');
			return;
		}
		try {
			sentinel = await navigator.wakeLock.request('screen');
			sentinel.addEventListener('release', () => {
				sentinel = null;
			});
		} catch (err) {
			console.warn('Could not keep the screen awake', err);
		}
	};

	const onVisibilityChange = () => {
		if (
			wanted &&
			sentinel === null &&
			document.visibilityState === 'visible'
		) {
			acquire();
		}
	};

	const request = () => {
		wanted = true;
		document.addEventListener('visibilitychange', onVisibilityChange);
		return acquire();
	};

	const release = () => {
		wanted = false;
		document.removeEventListener('visibilitychange', onVisibilityChange);
		if (sentinel !== null) {
			sentinel.release();
			sentinel = null;
		}
	};

	onUnmounted(release);

	return { request, release };
}
