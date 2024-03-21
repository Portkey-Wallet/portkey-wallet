const setDefaultProps = (Component: any, defaultProps: any) => {
  const componentRender = Component.render;
  if (!componentRender) {
    Component.defaultProps = defaultProps;
    return;
  }
  Component.render = (props: any, ref: any) => {
    props = {
      ...defaultProps,
      ...props,
      style: [defaultProps.style, props.style],
    };

    return componentRender.call(this, props, ref);
  };
};

export default setDefaultProps;
