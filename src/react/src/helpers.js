// def drawRAAndDec():
// 
//     """
//     draw position in RA and Dec
//     """
// 
//     # ra - draw randomly from 0 to 2pi
//     ra = np.random.uniform(0,2.*np.pi)
//     
// 
//     # dec - draw randomly from -1 to 1 in sin(dec)
//     sinDec = np.random.uniform(-1,1)    
//     # and convert from sin(dec) to dec
//     dec = np.arcsin(cosDec)
// 
//     
//     return ra, dec

const randomRange = (min, max) => Math.random() * (max - min) + min;

const randomRightAscensionAndDeclination = () => {
    // Right ascension is drawn randomly from 0 to 2pi
    const ra = randomRange(0, 2.0 * Math.PI);

    // Declination is drawn randomly from -1 to 1 in sin(dec) and then converted from sin(dec) to declination.
    const sinDec = randomRange(-1, 1);
    const dec = Math.asin(sinDec);

    return {alpha: ra, delta: dec};
};

export default randomRightAscensionAndDeclination;
