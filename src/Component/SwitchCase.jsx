const SwitchCase = ({ on, render_o, default_render }) => {
  let render = render_o[on];
  if (render === undefined) {
    if (default_render) {
      render = default_render;
    } else {
      console.error(`SwitchCase: Unhandeled value {${on}}`);
      return null;
    }
  }
  return render();
};

export { SwitchCase };
