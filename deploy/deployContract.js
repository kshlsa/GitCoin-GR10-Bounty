module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    
    const strategy =  await deploy('Strategy', {
         from: deployer,
         log: true,
     });


    await deploy('Vault', {
        from: deployer,
        log: true,
        args: [
            strategy.address,
        ]
    });
};

module.exports.tags = ['main'];
