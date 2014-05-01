require 'spec_helper'

describe 'Duplicate Service Options', reset: false do
  downloadable_dataset_id = 'C179003030-ORNL_DAAC'
  downloadable_dataset_title = '15 Minute Stream Flow Data: USGS (FIFE)'

  non_downloadable_dataset_id = 'C179001887-SEDAC'
  non_downloadable_dataset_title = '2000 Pilot Environmental Sustainability Index (ESI)'

  before :all do
    visit '/search'
    login
    add_dataset_to_project(downloadable_dataset_id, downloadable_dataset_title)
    add_dataset_to_project(non_downloadable_dataset_id, non_downloadable_dataset_title)

    dataset_results.click_link "View Project"
    click_link "Retrieve project data"
  end

  context "when setting options for downloadable dataset" do
    after :all do
      reset_access_page
    end

    it "shows 'additional access method' button" do
      expect(page).to have_button 'Add access method'
    end

    context "when clicking 'additional access method' button" do
      before :all do
        click_button 'Add access method'
      end

      it "adds an additional service option" do
        expect(page).to have_content 'Select Data Access Method', count: 2
      end

      it "displays a 'remove access method' icon" do
        expect(page).to have_css '.remove-access-item', count: 2
      end

      context "when clicking the 'remove access method' icon" do
        before :all do
          # click_on 'Remove access method'
          first('.remove-access-item').click
        end

        it "removes the access method" do
          expect(page).to have_content 'Select Data Access Method', count: 1
        end

        it "does not display a remove access method icon for the last access method" do
          expect(page).to have_no_css '.remove-access-item'
        end
      end
    end
  end

  context "when setting options for non-downloadable dataset" do
    before :all do
      choose 'Download'
      click_button 'Continue'
    end

    after :all do
      reset_access_page
    end

    it "does not show 'additional access method' button" do
      expect(page).to have_no_button 'Add access method'
    end
  end

  context "when submitting with multiple access options" do
    before :all do
      click_button 'Add access method'
      within '.access-item-selection:first-child' do
        choose 'Download'
      end
      within '.access-item-selection:nth-child(2)' do
        choose 'Download'
      end
      click_button 'Continue'
      click_button 'Continue'
      click_button 'Submit'
    end

    after :all do
      click_link 'Back to Data Access Options'
    end

    it "displays download links twice" do
      expect(page).to have_content '15 Minute Stream Flow Data: USGS (FIFE)', count: 2
    end
  end
end
