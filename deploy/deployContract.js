module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    await deploy('Vault', {
        from: deployer,
        log: true,
    });

     await deploy('Strategy', {
         from: deployer,
         log: true,
     });
};

module.exports.tags = ['main'];
