const SwitchCase = ({ on, renderO, defaultRender }) => {
  let render = renderO[on];
  if (render === undefined) {
    if (defaultRender) {
      render = defaultRender;
    } else {
      console.error(`SwitchCase: Unhandeled value {${on}}`);
      return null;
    }
  }
  return render();
};

export { SwitchCase };
