import React from "react";
import { Swipeable } from "react-swipeable";
import "./Suggestion.scss";

export default function Suggestion(props) {
  return (
    <div className={`suggestion`}>
      <Swipeable
        onSwipedLeft={(eventData) => props.next()}
        className="suggestion__display"
      >
        {props.selected ? (
          <>
            <div className="suggestion__theme">{props.selected.c}</div>
            <div className="suggestion__title">{props.selected.t}</div>
            <div className="suggestion__meta">{props.selected.d}</div>
          </>
        ) : (
          <div className="onboarding">
            <div>{props.onboardingTitle}</div>
            <div>{props.onboardingSubtitle}</div>
          </div>
        )}
      </Swipeable>
      <button className="button button--primary" onClick={() => props.next()}>
        {props.selected ? props.nextLabel : props.startLabel}
      </button>
    </div>
  );
}
