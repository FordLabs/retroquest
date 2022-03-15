/*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, {
	createContext,
	forwardRef,
	PropsWithChildren,
	Ref,
	useCallback,
	useContext,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react';
import classnames from 'classnames';

import { onKeys } from '../../Utils/EventUtils';

import './Modal.scss';

const NO_OP = () => undefined;

export interface ModalMethods {
	show: () => void;
	hide: () => void;
	setHideOnEscape: (enabled: boolean) => void;
	setHideOnBackdropClick: (enabled: boolean) => void;
}

const ModalContext = createContext<ModalMethods>({
	show: NO_OP,
	hide: NO_OP,
	setHideOnEscape: NO_OP,
	setHideOnBackdropClick: NO_OP,
});

type ModalProps = PropsWithChildren<{
	testId?: string;
	show?: boolean;
	hideOnEscape?: boolean;
	hideOnBackdropClick?: boolean;
	onHide?: () => void;
	className?: string;
}>;

function Modal(props: ModalProps, ref: Ref<ModalMethods>) {
	const {
		testId,
		show: showProp,
		hideOnEscape: hideOnEscapeProp,
		hideOnBackdropClick: hideOnBackdropClickProp,
		onHide,
		className,
		children,
	} = props;

	const [showState, setShowState] = useState(false);
	const [hideOnEscapeState, setHideOnEscapeState] = useState(true);
	const [hideOnBackdropClickState, setHideOnBackdropClickState] =
		useState(true);

	const show = showProp ?? showState;
	const hideOnEscape = hideOnEscapeProp ?? hideOnEscapeState;
	const hideOnBackdropClick =
		hideOnBackdropClickProp ?? hideOnBackdropClickState;

	const hide = useCallback(() => {
		if (showProp === undefined) {
			setShowState(false);
		}
		if (onHide) onHide();
	}, [showProp, onHide]);

	useEffect(() => {
		if (show && hideOnEscape) {
			const escapeListener = onKeys('Escape', hide);
			document.addEventListener('keydown', escapeListener);

			return () => document.removeEventListener('keydown', escapeListener);
		}
	}, [show, hide, hideOnEscape]);

	const modalMethods = useMemo(
		() => ({
			show: () => setShowState(true),
			hide: () => setShowState(false),
			setHideOnEscape: setHideOnEscapeState,
			setHideOnBackdropClick: setHideOnBackdropClickState,
		}),
		[]
	);

	useImperativeHandle(ref, () => modalMethods, [modalMethods]);

	return (
		<ModalContext.Provider value={modalMethods}>
			{show && (
				<div
					className="modal-backdrop"
					onClick={hideOnBackdropClick ? hide : undefined}
					data-testid="modalBackdrop"
				>
					<div
						data-testid={testId}
						className={classnames('modal', className)}
						onClick={(event) => event.stopPropagation()}
					>
						{children}
					</div>
				</div>
			)}
		</ModalContext.Provider>
	);
}

export default forwardRef<ModalMethods, ModalProps>(Modal);

export function useModal() {
	return useContext(ModalContext);
}
