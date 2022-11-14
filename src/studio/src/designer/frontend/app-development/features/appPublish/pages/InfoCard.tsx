import React from 'react';
import classNames from 'classnames';
import classes from './InfoCard.module.css';
import Illustration from './illustration-help-2-circle.svg';

export interface IAltinnInformationCardComponentProvidedProps {
  headerText: string;
  shadow: boolean;
}

export const InfoCard = (
  props: React.PropsWithChildren<IAltinnInformationCardComponentProvidedProps>,
) => {
  return (
    <div className={classes.container}>
      <div className={classNames(classes.scrollable)}>
        <div
          className={classNames(classes.paper, {
            [classes.shadowBox]: props.shadow,
          })}
        >
          <div className={classes.textContainer}>
            <h1 className={classes.header}>{props.headerText}</h1>
            <p className={classes.breadText}>{props.children}</p>
          </div>
          <div className={classes.imageContainer}>
            <Illustration />
          </div>
        </div>
      </div>
    </div>
  );
};