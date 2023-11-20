module.exports = (sequelize, DataTypes) =>{
    const Image = sequelize.define("Image",{
        ImageURL: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "https://cdn.discordapp.com/emojis/1173874458713403412.webp?size=128&quality=lossless"
        },
        Likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        Topic:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "all"
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        }
    });

    return Image
}