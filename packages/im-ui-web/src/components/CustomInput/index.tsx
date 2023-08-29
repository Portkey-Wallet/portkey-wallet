import React, { useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { IInputProps } from '../../type';
import './index.less';

const CustomInput: React.FC<IInputProps> = ({
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
      if (props.maxLength && (e.target.value || '').length > props.maxLength) {
        if (props.onMaxLengthExceed instanceof Function) props.onMaxLengthExceed();

        if (props.reference?.current?.value == (e.target.value || '').substring(0, props.maxLength)) return;
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
      target: props.reference?.current,
    };
    if (props.reference?.current?.value) {
      props.reference.current.value = '';
    }
    onChangeEvent(_event);
  }, [onChangeEvent, props.reference]);

  useEffect(() => {
    const _event = {
      FAKE_EVENT: true,
      target: props.reference?.current,
    };
    onChangeEvent(_event);
  }, [props.value, props.reference, onChangeEvent]);

  useEffect(() => {
    if (autofocus === true) props.reference?.current?.focus();

    if (props.clear instanceof Function) {
      props.clear(clear);
    }
  }, [autofocus, clear, props]);

  return (
    <div className={classNames('portkey-container-input', props.className)}>
      {multiline === false ? (
        <input
          ref={props.reference}
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
          maxLength={props?.maxLength}
          value={props.value}
          ref={props.reference}
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
          onKeyUp={props.onKeyUp}
        />
      )}
    </div>
  );
};

export default CustomInput;
