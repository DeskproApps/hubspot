function generic_validator({ required, valid }) {
  const valid_S = new Set(valid.concat(required));

  return ({ name_a }) => {
    try {
      const name_S = new Set(name_a);
      [
        [required, name_S, "Missing property"],
        [name_S, valid_S, "Invalid property"],
      ].forEach(([subset, superset, error_text]) => {
        subset.forEach((name) => {
          if (!superset.has(name)) {
            throw new Error(`${error_text}: ${name}`);
          }
        });
      });
    } catch (e) {
      return {
        failed: true,
        reason: e,
      };
    }
    return {};
  };
}

export { generic_validator };
