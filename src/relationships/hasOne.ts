const hasOne = config => (where, options, orm, modelKey) => {
    const { idAttribute } = orm.getModel(config.model);
    
    return orm.findOneFrom(modelKey, {
        where,
        attributes: [config.mapTo]
    }).then(res => {
        return orm.findOneFrom(config.model, {
            ...options,
            where: {
                [idAttribute]: res[config.mapTo]
            }
        })
    });
};

export default hasOne;