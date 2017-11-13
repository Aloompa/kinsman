const hasMany = config => (where, options, orm, modelKey) => {
    const { idAttribute } = orm.getModel(config.model);
    
    return orm.findOneFrom(modelKey, {
        where,
        attributes: [config.mapTo]
    }).then(res => {
        return Promise.all(
            res[config.mapTo].map(id => orm.findOneFrom(config.model, {
                ...options,
                where: {
                    [idAttribute]: id
                }
            }))
        );
    });
}

export default hasMany;