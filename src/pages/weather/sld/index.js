export default {
  getTemSld(layerName) {
    var sld = `
      <StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
        <NamedLayer>
          <Name>map:${layerName}</Name>
          <UserStyle>
            <Title>Temprature</Title>
            <FeatureTypeStyle>
              <Rule>
                <RasterSymbolizer>
                  <ColorMap type="ramp">
                    <ColorMapEntry color="#0500ff" quantity="-98.9" label="no data" opacity="0" />
                    <ColorMapEntry color="#0500ff" quantity="-50" label="-50" opacity="1" />
                    <ColorMapEntry color="#00a4ff" quantity="-20" label="-20" opacity="1"/>
                    <ColorMapEntry color="#00fff4" quantity="0" label="0" opacity="1"/>
                    <ColorMapEntry color="#3eff00" quantity="10" label="10" opacity="1"/>
                    <ColorMapEntry color="#FFa000" quantity="20" label="20" opacity="1"/>
                    <ColorMapEntry color="#FF4600" quantity="40" label="40" opacity="1"/>
                    <ColorMapEntry color="#FF0000" quantity="50" label="50" opacity="1"/>
                  </ColorMap>
                </RasterSymbolizer>
              </Rule>
            </FeatureTypeStyle>
          </UserStyle>
        </NamedLayer>
      </StyledLayerDescriptor>`

    return sld
  },
  getRainSld(layerName) {
    var sld = `
      <StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
        <NamedLayer>
          <Name>map:${layerName}</Name>
          <UserStyle>
            <Title>Dryness Products (Test)</Title>
            <FeatureTypeStyle>
              <Rule>
                <RasterSymbolizer>
                  <ColorMap>
                    <ColorMapEntry color="#ffffff" quantity="0" label="0 transparent" opacity="0" />
                    <ColorMapEntry color="#ffffff" quantity="0.1" label="0 #ffffff" opacity="1" />
                    <ColorMapEntry color="#85fd83" quantity="10" label="0 - 10 #85fd83" opacity="1" />
                    <ColorMapEntry color="#00c624" quantity="25" label="10 - 25 #00c624" opacity="1"/>
                    <ColorMapEntry color="#3eb9fc" quantity="50" label="25 - 50 #3eb9fc" opacity="1"/>
                    <ColorMapEntry color="#3d00ff" quantity="100" label="50 - 100 #3d00ff" opacity="1"/>
                    <ColorMapEntry color="#ff00ff" quantity="250" label="100 - 250 #ff00ff" opacity="1"/>
                    <ColorMapEntry color="#88003f" quantity="400" label="250 - 400 #88003f" opacity="1"/>
                  </ColorMap>
                </RasterSymbolizer>
              </Rule>
            </FeatureTypeStyle>
          </UserStyle>
        </NamedLayer>
      </StyledLayerDescriptor>`

    return sld
  },
}