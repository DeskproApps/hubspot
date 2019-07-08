function genericValidator({ required, valid }) {
  const valid_S = new Set(valid.concat(required));

  return ({ nameA }) => {
    try {
      const name_S = new Set(nameA);
      [
        [required, name_S, "Missing property"],
        [name_S, valid_S, "Invalid property"],
      ].forEach(([subset, superset, errorText]) => {
        subset.forEach((name) => {
          if (!superset.has(name)) {
            throw new Error(`${errorText}: ${name}`);
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

export { genericValidator };
