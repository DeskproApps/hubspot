const SwitchCase = ({on, render_o, default_render}) => {
  let render = render_o[on];
  if (render === void 0) {
    if (default_render) {
      render = default_render;
    } else {
      console.error(`SwitchCase: Unhandeled value {${on}}`);
      return;
    }
  }
  return render();
};

export { SwitchCase };
