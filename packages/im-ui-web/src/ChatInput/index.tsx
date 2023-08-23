import React, { useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { IInputProps } from '../type';
import './index.less';

const Input: React.FC<IInputProps> = ({
  type = 'text',
  multiline = false,
  minHeight = 40,
  maxHeight = 140,
  autoHeight = true,
  autofocus = false,
  ...props
}) => {
  const onChangeEvent = useCallback(
    (e: any) => {
      if (props.maxlength && (e.target.value || '').length > props.maxlength) {
        if (props.onMaxLengthExceed instanceof Function) props.onMaxLengthExceed();

        if (props.referance?.current?.value == (e.target.value || '').substring(0, props.maxlength)) return;
      }

      if (props.onChange instanceof Function) props.onChange(e);

      if (multiline === true) {
        if (!e.target.value) {
          e.target.style.height = minHeight + 'px';
          e.target.style.scrollTop = minHeight + 'px';
        }
        if (autoHeight === true) {
          if (e.target.style.height !== minHeight + 'px') {
            e.target.style.height = minHeight + 'px';
            e.target.style.scrollTop = minHeight + 'px';
          }

          let height;
          if (e.target.scrollHeight <= maxHeight) height = e.target.scrollHeight + 'px';
          else height = maxHeight + 'px';

          if (e.target.style.height !== height) {
            e.target.style.height = height;
            e.target.style.scrollTop = height;
          }
        }
      }
    },
    [autoHeight, maxHeight, minHeight, multiline, props],
  );
  const clear = useCallback(() => {
    const _event = {
      FAKE_EVENT: true,
      target: props.referance?.current,
    };

    if (props.referance?.current?.value) {
      props.referance.current.value = '';
    }

    onChangeEvent(_event);
  }, [onChangeEvent, props.referance]);

  useEffect(() => {
    if (autofocus === true) props.referance?.current?.focus();

    if (props.clear instanceof Function) {
      props.clear(clear);
    }
  }, [autofocus, clear, props]);

  useEffect(() => {
    if (!props.value && props.referance) {
      props.referance.current.style.height = minHeight + 'px';
      props.referance.current.style.scrollTop = minHeight + 'px';
    }
  }, [props.value, props.referance, minHeight]);

  return (
    <div className={classNames('portkey-container-input', props.className)}>
      {multiline === false ? (
        <input
          ref={props.referance}
          type={type}
          className={classNames('portkey-im-input')}
          placeholder={props.placeholder}
          defaultValue={props.defaultValue}
          style={props.inputStyle}
          onChange={onChangeEvent}
          onCopy={props.onCopy}
          onCut={props.onCut}
          onPaste={props.onPaste}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          onSelect={props.onSelect}
          onSubmit={props.onSubmit}
          onReset={props.onReset}
          onKeyDown={props.onKeyDown}
          onKeyPress={props.onKeyPress}
          onKeyUp={props.onKeyUp}
          value={props.value}
        />
      ) : (
        <textarea
          maxLength={props?.maxlength}
          value={props.value}
          ref={props.referance}
          className={classNames('portkey-im-input', 'portkey-im-input-textarea')}
          placeholder={props.placeholder}
          defaultValue={props.defaultValue}
          style={props.inputStyle}
          onChange={onChangeEvent}
          onCopy={props.onCopy}
          onCut={props.onCut}
          onPaste={props.onPaste}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          onSelect={props.onSelect}
          onSubmit={props.onSubmit}
          onReset={props.onReset}
          onKeyDown={props.onKeyDown}
          onKeyPress={props.onKeyPress}
          onKeyUp={props.onKeyUp}>
          {props.defaultValue ? props?.value ?? null : null}
        </textarea>
      )}
    </div>
  );
};

export default Input;
